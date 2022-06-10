import { Injectable, Query } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Script, ScriptDocument } from '../../schemas/script.schema';
import { scriptDto } from '../../models/dto/scriptDto';
import fs = require('fs');
import { status } from '../../models/general/status';

@Injectable()
export class ScriptService {
    months:string[] = ["January","February","March","April","May","June","July","August","September","October","November","December"];
    
    constructor(@InjectModel(Script.name) private scriptModel: Model<ScriptDocument>){
        
    }

    async create(user:string,name:string,boardGameId:string,stat:status,files:string[],icon:string,id:string): Promise<Script> {
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
            status: stat,
            size: 0,
            comments: [],
            files: [],
            icon: icon
        };

        for(let count = 0; count < files.length; count++){
            dto.files.push({name:"",path:""});

            dto.files[count].path = "libs/uploads/src/lib/scripts/files/" + id + "/" + files[count];
            dto.files[count].name = files[count];

            if(dto.files[count].name.indexOf(".module.ts") == -1){
                dto.files[count].name += ".module.ts";
                dto.files[count].path += ".module.ts";
            }
            try{
                fs.mkdirSync("libs/uploads/src/lib/scripts/files/" + id,{recursive:true});
            }catch(err){
                console.log(err);
            }
            if(count == 0)
            {
                let content = "import { NgModule } from '@angular/core';\nimport { CommonModule } from '@angular/common';\n@NgModule({\ndeclarations: [\n],\nimports: [\nCommonModule\n\n]\n})\n\nexport class "+name+"Module {}";
                fs.readFile("libs/uploads/src/lib/scripts/files/default.txt", (error, data) => {
                    if(error) {
                        throw error;
                    }
                    content = data.toString();
                });

                fs.writeFile(dto.files[count].path,content,(err)=>{
                    if(err)
                        console.log(err);
                });

                //update uploads.module.ts
                fs.readFile('libs/uploads/src/lib/uploads.module.ts', 'utf8', (err, data) => {
                    if (err) {
                    console.error(err);
                    return;
                    }
                    let b = " ,DefaultModule";
                    
                    let position = data.indexOf("]");
                    let output = [data.slice(0, position), b, data.slice(position)].join('');

                    b="import { "+name+"Module } from './scripts/files/"+id+"/main.module';"
                    position = 0;
                    output = [output.slice(0, position), b, output.slice(position)].join('');

                    fs.writeFile('libs/uploads/src/lib/uploads.module.ts',output,(err)=>{
                        if(err)
                            console.log(err);
                    });
                });
            }
            else
            {
                fs.writeFile(dto.files[count].path,'',(err)=>{
                    if(err)
                        console.log(err);
                });
            }

        }
        
        
        const createdScript = new this.scriptModel(dto);
        
        return createdScript.save();


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
