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

@Injectable()
export class ScriptService {
    months:string[] = ["January","February","March","April","May","June","July","August","September","October","November","December"];
    
    constructor(@InjectModel(Script.name) private scriptModel: Model<ScriptDocument>,private readonly s3Service:S3Service){
        
    }

    async create(user:string,name:string,boardGameId:string,stat:status,icon:any): Promise<Script> {
        const dto:scriptDto = {
            name: name,
            author: user,
            boardgame: boardGameId,
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
        let temp:file = {name:"main.js",location:""};
        const path = "scripts/" + id + "/files/";
        let data = "";

        console.log(process.cwd());

        try{
            data = fs.readFileSync("templates/main.js","utf8");
        }catch(err){
            console.log(err);
        }

        temp.location = await this.s3Service.upload("main.js",path,data,"text/javascript");

        result.push(temp);

        temp = {name:"interface.json",location:""};
        
        try{
            data = fs.readFileSync("templates/interface.json","utf8");
        }catch(err){
            console.log(err);
        }

        temp.location = await this.s3Service.upload("interface.json",path,data,"application/json");
        result.push(temp);

        return result;
    }

    async storeIcon(id:string,icon:any):Promise<string>{
        let result = "";
        const path = "scripts/" + id + "/icons/";
        
        result = await this.s3Service.upload(icon.originalname,path,icon.buffer,icon.mimetype);

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

    async findById(id:number):Promise<Script>{
        return this.scriptModel.findById(id).exec();
    }

    async updateInfo(id:string,name:string,pub:boolean,exp:boolean,stat:status){
        return this.scriptModel.findByIdAndUpdate(id,{name:name,public:pub,export:exp,status:stat}).exec();
    }
}
