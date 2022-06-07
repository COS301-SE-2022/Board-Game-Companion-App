import { Injectable, Query } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Script, ScriptDocument } from '../../schemas/script.schema';
import { scriptDto } from '../../models/dto/scriptDto';
import fs = require('fs');
import { status } from '../../models/general/status';

@Injectable()
export class ScriptService {
    constructor(@InjectModel(Script.name) private scriptModel: Model<ScriptDocument>){

    }

    async create(user:string,name:string,boardGameId:string,files:string[],icon:string,id:string): Promise<Script> {
        const dto:scriptDto = {
            name: name,
            author: user,
            boardgame: boardGameId,
            created: new Date(),
            published: null,
            lastupdate: new Date(),
            downloads: 0,
            lastdownload: null,
            public: false,
            export: false,
            status: status.inProgress,
            size: 0,
            comments: [],
            files: [],
            icon: icon
        };

        for(let count = 0; count < files.length; count++){
            dto.files.push({name:"",path:""});

            dto.files[count].path = "uploads/scripts/files/" + id + "/" + files[count];
            dto.files[count].name = files[count];

            if(dto.files[count].name.indexOf(".ts") == -1){
                dto.files[count].name += ".ts";
                dto.files[count].path += ".ts";
            }
            try{
                fs.mkdirSync("uploads/scripts/files/" + id,{recursive:true});
            }catch(err){
                console.log(err);
            }

            fs.writeFile(dto.files[count].path,'',(err)=>{
                if(err)
                    console.log(err);
            });
        }

        if((await this.contains(name)).valueOf)
            return null;

        const createdScript = new this.scriptModel(dto);
        
        return createdScript.save();
    }

    async contains(name:string):Promise<boolean>{
        let result = true;

        const value = await this.scriptModel.find({name:name}).exec();
        
        if(value)
            result = false;

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

    // async findByName(name:string):Promise<Script>{
    //     return this.scriptModel.find({name:'joseph'}).exec();
    // }
}
