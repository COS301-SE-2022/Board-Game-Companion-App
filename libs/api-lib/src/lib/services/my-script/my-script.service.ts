import { HttpException, HttpStatus, Injectable, Query } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { MyScript, MyScriptDocument } from '../../schemas/my-script.schema';
import { NeuralNetwork, NeuralNetworkDocument } from '../../schemas/neural-network.schema';
import { myScriptDto } from '../../models/dto/myScriptDto';
import fs = require('fs');
import http = require('http');
import { status } from '../../models/general/status';
import { S3Service } from '../aws/s3.service'
import { file } from '../../models/general/files';
import { v4 as uuidv4 } from 'uuid';
import { upload } from '../../models/general/upload';
import { CompilerService } from '../compiler/compiler.service';
import fileSize = require("url-file-size");
import { user } from '../../models/general/user';
import { HttpService } from '@nestjs/axios';
import { LocalStorageService } from '../local-storage/local-storage.service';
import { entity } from '../../models/general/entity';
import { AutomataService } from '../automata/automata.service';
import { version } from '../../models/general/version';

@Injectable()
export class MyScriptService {
    months:string[] = ["January","February","March","April","May","June","July","August","September","October","November","December"];
    
    constructor(@InjectModel(MyScript.name) private myScriptModel: Model<MyScriptDocument>,
    private readonly localStorage: LocalStorageService,
    private readonly automataService: AutomataService){
        
    }


    async create(user:user,name:string,boardGameId:string,stat:status,description:string,icon:any): Promise<MyScript> {
        const dto:myScriptDto = {
            name: name,
            author: user,
            version: {major:0,minor:0,patch:0},
            boardgame: boardGameId,
            description: description,
            created: new Date(),
            lastUpdate: new Date(),
            export: false,
            status: stat,
            size: 0,
            programStructure:{type:"root",name:"root",endLine:0,endPosition:0,startLine:0,startPosition:0,properties:[],children:[]},
            source: {name:"",location:"",key:""},
            build:{name:"",location:"",key:""},
            icon: {name:"",location:"",key:""},
            models: []
        };
        
        
        const createdScript = new this.myScriptModel(dto);
        const result:MyScriptDocument =  await createdScript.save();
        
        result.source = await this.createSourceFile(result._id);
        result.build = await this.createBuildFile(result._id);
        result.size = await fileSize(result.build.location).catch(console.error);
        const savedIcon = await this.storeIcon(result._id,icon);
        result.icon = {name: icon.originalname,location:savedIcon.location,key:savedIcon.key};

        result.save();

        return result;
    }


    async createSourceFile(id:string):Promise<file>{
        const result:file = {name:"main.txt",location:"",key:""};
        let fileUploadResult:upload = {key:"",location:""};
        const path = "scripts/my-scripts/" + id + "/src/";
        let data = "";

        try{
            data = fs.readFileSync("templates/main.txt","utf8");
        }catch(err){
            console.log(err);
        }

        //fileUploadResult = await this.s3Service.upload("main.txt",path,data);
        fileUploadResult = await this.localStorage.upload("main.txt",path,data);
        result.location = fileUploadResult.location;
        result.key = fileUploadResult.key;

        return result;
    }

    async createBuildFile(id:string):Promise<file>{
        const result:file = {name:"main.js",location:"",key:""};
        let fileUploadResult:upload = {key:"",location:""};
        const path = "scripts/my-scripts/" + id + "/build/";
        let data = "";

        try{
            data = fs.readFileSync("templates/script.js","utf8");
        }catch(err){
            console.log(err);
        }

        //fileUploadResult = await this.s3Service.upload("main.js",path,data);
        fileUploadResult = await this.localStorage.upload("main.js",path,data);
        result.location = fileUploadResult.location;
        result.key = fileUploadResult.key;
        console.log(result);
        
        return result;        
    }

    async storeIcon(id:string,icon:any):Promise<upload>{
        const path = "scripts/my-scripts/" + id + "/icons/";
        
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

    async getAllMyScript(owner:user):Promise<MyScript[]>{
        return this.myScriptModel.find({"owner.name":owner.name,"owner.email":owner.email});
    }

    async checkName(name:string,user:user):Promise<boolean>{
        const id = await this.myScriptModel.exists({"name":name,"author.name":user.name,"author.email":user.email});

        return id !== null;
    }

    async update(id:string,exp:boolean,description:string):Promise<MyScript>{
        const result = await this.myScriptModel.findById(id);
        
        result.export = exp;
        result.description = description;
        
        result.save();
        return result;
    }

    async release(id:string,version:version):Promise<{success:boolean,message?:string}>{
        const script = await this.myScriptModel.findById(id);

        if(script === null || script === undefined)
            return {success: false,message: "Can not find script you are trying to release."};
        
        
    }
}
