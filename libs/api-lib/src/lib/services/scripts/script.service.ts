import { Injectable, Query } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Script, ScriptDocument } from '../../schemas/script.schema';
import { scriptDto } from '../../models/dto/scriptDto';
import fs = require('fs');
import http = require('http');
import { status } from '../../models/general/status';
import { S3Service } from '../aws/s3.service'
import { file } from '../../models/general/files';
import { v4 as uuidv4 } from 'uuid';
import { awsUpload } from '../../models/general/awsUpload';
import { CompilerService } from '../compiler/compiler.service';
import fileSize = require("url-file-size");
import { user } from '../../models/general/user';
import { HttpService } from '@nestjs/axios';
import { LocalStorageService } from '../local-storage/local-storage.service';
import { entity } from '../../models/general/entity';

interface programResult{
    build:string;
    programStructure:entity;
}
interface errResult{
    err:string;
}

@Injectable()
export class ScriptService {
    months:string[] = ["January","February","March","April","May","June","July","August","September","October","November","December"];
    
    constructor(@InjectModel(Script.name) private scriptModel: Model<ScriptDocument>,
    private readonly s3Service:S3Service,
    private readonly compilerService:CompilerService,
    private readonly httpService: HttpService,
    private readonly localStorage: LocalStorageService){
        
    }

    async updateBuild(id:string,compiledCode:string): Promise<{status:boolean,script:Script}>{
        let status = true;
        const path = "scripts/" + id + "/build/";
        const script:ScriptDocument = await this.scriptModel.findById(id).exec();
        
        try{
            //const fileUploadResult = await this.s3Service.upload("main.js",path,compiledCode);
            const fileUploadResult = await this.localStorage.upload("main.js",path,compiledCode)
            script.build = {
                name:"main.js",
                location:fileUploadResult.location,
                awsKey:fileUploadResult.key
            };

            script.size = await fileSize(script.build.location).catch(console.error);
    
            script.save();
        }catch(e){
            status = false;
        }


        return {status:status,script:script};
    }

    async create(user:user,name:string,boardGameId:string,stat:status,description:string,icon:any): Promise<Script> {
        const dto:scriptDto = {
            name: name,
            author: user,
            owner: user,
            boardgame: boardGameId,
            description: description,
            created: new Date(),
            release: null,
            lastupdate: new Date(),
            downloads: 0,
            lastdownload: null,
            public: false,
            export: false,
            status: stat,
            size: 0,
            comments: [],
            programStructure:{type:"root",name:"root",endLine:0,endPosition:0,startLine:0,startPosition:0,properties:[],children:[]},
            source: {name:"",location:"",awsKey:""},
            build:{name:"",location:"",awsKey:""},
            icon: {name:"",location:"",awsKey:""}
        };
        
        
        const createdScript = new this.scriptModel(dto);
        const result:ScriptDocument =  await createdScript.save();
        
        result.source = await this.createSourceFile(result._id);
        result.build = await this.createBuildFile(result._id);
        result.size = await fileSize(result.build.location).catch(console.error);
        const savedIcon = await this.storeIcon(result._id,icon);
        result.icon = {name: icon.originalname,location:savedIcon.location,awsKey:savedIcon.key};

        result.save();

        return result;
    }

    async download(id:string,owner:user):Promise<{status:string,message:string,script:Script}>{
        //warning
        //success
        //info
        //failed
        const result = {
            status:"",
            message:"",
            script:null
        }

        let script = await this.scriptModel.findOne({_id:id,owner:owner});
        
        if(script !== null){
            result.status = "info";
            result.message = "You already downloaded " + script.name + ".";
        }else{
            script = await this.scriptModel.findById(id);  
            
            if(script === null){
                result.status = "danger";
                result.message = "The script you are trying to download does not exist.";
            }else{
                if(script.status.value !== 2){
                    result.status = "danger";
                    
                    if(script.status.value === 0)
                        result.message = "The script you are trying to download has been flagged.";
                    
                    if(script.status.value === 1)
                        result.message = "The script you are trying to download is still in development.";
                }else{
                    const dto:scriptDto = {
                        name: script.name,
                        author: script.author,
                        owner: owner,
                        boardgame: script.boardgame,
                        description: script.description,
                        created: new Date(script.created),
                        release: script.release,
                        lastupdate: script.lastupdate,
                        downloads: script.downloads,
                        lastdownload: script.lastdownload,
                        public: script.public,
                        export: script.public,
                        status: script.status,
                        size: script.size,
                        comments: script.comments,
                        programStructure:{type:"root",name:"root",endLine:0,endPosition:0,startLine:0,startPosition:0,properties:[],children:[]},
                        source: {name:"",location:"",awsKey:""},
                        build:{name:"",location:"",awsKey:""},
                        icon: {name:"",location:"",awsKey:""}
                    };

                    const createdScript = new this.scriptModel(dto);
                    const newScript:ScriptDocument = await createdScript.save();
                    const data  = (await this.httpService.axiosRef.get(script.build.location,{
                        responseType:'text'
                    })).data;

                    //const buildResponse = await this.s3Service.upload(script.build.name,"scripts/" + newScript._id + "/build/",data);
                    const buildResponse = await this.localStorage.upload(script.build.name,"scripts/" + newScript._id + "/build/",data);
                    //console.log(buildResponse)
                    newScript.build.name = script.build.name;
                    newScript.build.awsKey = buildResponse.key;
                    newScript.build.location = buildResponse.location;

                    
                    const image = (await this.httpService.axiosRef.get(script.icon.location));
                    console.log(image)
                    //const savedIcon = await this.s3Service.upload(script.icon.name,"scripts/" + newScript._id + "/icons/",image);
                    const savedIcon = await this.localStorage.upload(script.icon.name,"scripts/" + newScript._id + "/icons/",image)
                    newScript.icon = {
                        name: script.icon.name,
                        location: savedIcon.location,
                        awsKey: savedIcon.key
                    }

                    newScript.save();
                    result.script = newScript;
                    
                }
            }
        }

        return result;
    }

    async createSourceFile(id:string):Promise<file>{
        const result:file = {name:"main.txt",location:"",awsKey:""};
        let fileUploadResult:awsUpload = {key:"",location:""};
        const path = "scripts/" + id + "/src/";
        let data = "";

        try{
            data = fs.readFileSync("templates/main.txt","utf8");
        }catch(err){
            console.log(err);
        }

        //fileUploadResult = await this.s3Service.upload("main.txt",path,data);
        fileUploadResult = await this.localStorage.upload("main.txt",path,data);
        result.location = fileUploadResult.location;
        result.awsKey = fileUploadResult.key;

        return result;
    }

    async createBuildFile(id:string):Promise<file>{
        const result:file = {name:"main.js",location:"",awsKey:""};
        let fileUploadResult:awsUpload = {key:"",location:""};
        const path = "scripts/" + id + "/build/";
        let data = "";

        try{
            data = fs.readFileSync("templates/script.js","utf8");
        }catch(err){
            console.log(err);
        }

        //fileUploadResult = await this.s3Service.upload("main.js",path,data);
        fileUploadResult = await this.localStorage.upload("main.js",path,data);
        result.location = fileUploadResult.location;
        result.awsKey = fileUploadResult.key;
        console.log(result);
        
        return result;        
    }

    async updateStatus(id:string,value:number,message:string):Promise<Script>{
        const result:ScriptDocument = await this.scriptModel.findById(id);
        result.status = {
            value: value,
            message: message
        }

        if(value === 2)
            result.release = new Date();
        else
            result.release = null;

        result.save();

        return result;
    }

    async storeIcon(id:string,icon:any):Promise<awsUpload>{
        const path = "scripts/" + id + "/icons/";
        
        //const result = await this.s3Service.upload(icon.originalname,path,icon.buffer);
        const result = await this.localStorage.upload(icon.originalname,path,icon.buffer);
        return result;
    }

    formatDate(date:Date):string{
        let result = "";
        
        const val = new Date(date);
    
        result = val.getDate() + " ";
        result += this.months[val.getMonth()] + " ";
        result += val.getFullYear() + ", ";
        result += val.getHours() + ":" + val.getMinutes() + ":" + val.getSeconds();
    
        return result;
      }

    async removeById(id:string): Promise<void>{
        this.scriptModel.findByIdAndRemove(id).exec();
    }

    async findAll(): Promise<Script[]>{ 
        return this.scriptModel.find().exec();
    }

    async getScriptsCreatedByMe(owner:user): Promise<Script[]>{
        return this.scriptModel.find({"owner.email":owner.email,"author.email":owner.email}).exec();
    }

    async getScriptsDownloadedByMe(owner:user):Promise<Script[]>{
        return this.scriptModel.find({"owner.email":owner.email,"author.email":{$ne:owner.email}})
    }

    async getOtherScripts(owner:user):Promise<Script[]>{
        return this.scriptModel.find({"owner.email":{$ne:owner.email},"author.email":{$ne:owner.email}});
    }

    async findById(id:number):Promise<Script>{
        return this.scriptModel.findById(id).exec();
    }

    async updateInfo(id:string,name:string,pub:boolean,exp:boolean,stat:status){
        return this.scriptModel.findByIdAndUpdate(id,{name:name,public:pub,export:exp,status:stat}).exec();
    }


    async updateFile(id:string,content:string):Promise<any>{
        const script:ScriptDocument = await this.scriptModel.findById(id);
        let result:any = {status:"success",message:""}

        if(script === null)
            result = {status:"failed",message: "invalid script id"};
        else{
            try{
                const compilerResult = this.compilerService.transpile(content);
                const err = compilerResult as errResult;
                const compiledCode = compilerResult as programResult;
                if(err.err)
                {
                    throw new Error(err.err);
                }
                result = {status:"success",message:"successfully updated script on " + (new Date()).toString(),programStructure:compiledCode.programStructure};
                
                await this.updateBuild(id,compiledCode.build);
                //this.s3Service.update(script.source.awsKey,content);
                await this.localStorage.update(script.source.awsKey,content);
                script.lastupdate = new Date();
                script.programStructure = compiledCode.programStructure;
                script.save();
            
            }catch(e){
                //console.log(e);
                result = {status:"failed",message:e};
            }
        }
        //console.log(result)
        return result;
    }

    async addComment(scriptId:string,commentId:string): Promise<void>{
        const script:ScriptDocument = await this.scriptModel.findById(scriptId);
        let add = true;

        for(let count = 0; count < script.comments.length && add; count++){
            if(script.comments[count] === commentId)
                add = false;
        }
        
        script.comments.unshift(commentId);
        
        script.save();
    }
}
