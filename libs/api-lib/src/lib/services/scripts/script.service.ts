import { Injectable, Query } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Script, ScriptDocument } from '../../schemas/script.schema';
import { scriptDto } from '../../models/dto/scriptDto';
import fs = require('fs');
import { status } from '../../models/general/status';
import { S3Service } from '../../services/aws/s3.service';
import { file } from '../../models/general/files';
import { v4 as uuidv4 } from 'uuid';
import { awsUpload } from '../../models/general/awsUpload';
import { CompilerService } from '../compiler/compiler.service';

@Injectable()
export class ScriptService {
    months:string[] = ["January","February","March","April","May","June","July","August","September","October","November","December"];
    
    constructor(@InjectModel(Script.name) private scriptModel: Model<ScriptDocument>,private readonly s3Service:S3Service,private readonly compilerService:CompilerService){
        
    }

    async saveBuild(id:string,compiledCode:string): Promise<{status:boolean,script:Script}>{
        let status = true;
        const path = "scripts/" + id + "/build/";
        const script:ScriptDocument = await this.scriptModel.findById(id).exec();
        
        try{
            const fileUploadResult = await this.s3Service.upload("main.js",path,compiledCode,"text/javascript");
            script.build = {
                name:"main.js",
                location:fileUploadResult.location,
                awsKey:fileUploadResult.key
            };
    
            script.save();
        }catch(e){
            status = false;
        }


        return {status:status,script:script};
    }

    async create(user:string,name:string,boardGameId:string,stat:status,description:string,icon:any): Promise<Script> {
        const dto:scriptDto = {
            name: name,
            author: user,
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
            source: null,
            build:null,
            icon: ""
        };
        
        
        const createdScript = new this.scriptModel(dto);
        const result:ScriptDocument =  await createdScript.save();
        
        result.source = await this.createInitialFile(result._id);
        result.icon = await this.storeIcon(result._id,icon);
        
        result.save();

        return result;
    }

    async createInitialFile(id:string):Promise<file>{
        const result:file = {name:"main.txt",location:"",awsKey:""};
        let fileUploadResult:awsUpload = {key:"",location:""};
        const path = "scripts/" + id + "/src/";
        let data = "";

        try{
            data = fs.readFileSync("templates/main.txt","utf8");
        }catch(err){
            console.log(err);
        }

        fileUploadResult = await this.s3Service.upload("main.txt",path,data,"text/plain");
        result.location = fileUploadResult.location;
        result.awsKey = fileUploadResult.key;

        return result;
    }

    async storeIcon(id:string,icon:any):Promise<string>{
        const path = "scripts/" + id + "/icons/";
        
        const result = await this.s3Service.upload(icon.originalname,path,icon.buffer,icon.mimetype);

        return result.location;
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
                result = {status:"success",message:this.compilerService.parse(content)};
                
                this.s3Service.update(script.source.awsKey,content);
                script.lastupdate = new Date();
                script.save();
            
            }catch(e){

                result = {status:"failed",message:e};
            }
        }

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
