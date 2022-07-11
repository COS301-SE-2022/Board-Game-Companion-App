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

@Injectable()
export class ScriptService {
    months:string[] = ["January","February","March","April","May","June","July","August","September","October","November","December"];
    
    constructor(@InjectModel(Script.name) private scriptModel: Model<ScriptDocument>,private readonly s3Service:S3Service){
        
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
            files: [],
            icon: ""
        };
        
        const id = uuidv4();
        dto.files = await this.createInitialFiles(id);
        dto.icon = await this.storeIcon(id,icon);
        
        
        const createdScript = new this.scriptModel(dto);
        const result:Script =  await createdScript.save();

        return result;
    }

    async createInitialFiles(id:string):Promise<file[]>{
        const result:file[] = [];
        let temp:file = {name:"main.js",location:"",awsKey:""};
        let fileUploadResult:awsUpload = {key:"",location:""};
        const path = "scripts/" + id + "/files/";
        let data = "";

        console.log(process.cwd());

        try{
            data = fs.readFileSync("templates/main.js","utf8");
        }catch(err){
            console.log(err);
        }

        fileUploadResult = await this.s3Service.upload("main.js",path,data,"text/plain");
        temp.location = fileUploadResult.location;
        temp.awsKey = fileUploadResult.key;

        result.push(temp);

        temp = {name:"interface.json",location:"",awsKey:""};
        
        try{
            data = fs.readFileSync("templates/interface.json","utf8");
        }catch(err){
            console.log(err);
        }

        fileUploadResult = await this.s3Service.upload("interface.json",path,data,"application/json");
        temp.location = fileUploadResult.location;
        temp.awsKey = fileUploadResult.key;
        
        result.push(temp);

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


    async updateFile(id:string,name:string,content:string):Promise<string>{
        const script:ScriptDocument = await this.scriptModel.findById(id);
        let result = "success";

        if(script === null )
            result = "invalid script id";
        else{
            if(name !== "main.js" && name !== "interface.json")
                result = "invalid file name";
            else{
                const index = name === "main.js" ? 0 : 1;

                try{
                    this.s3Service.update(script.files[index].awsKey,content);
                    script.lastupdate = new Date();
                    script.save();
                }catch(e){
                    result = "something went wrong while upload file, contact developers if this error persists";
                }
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
