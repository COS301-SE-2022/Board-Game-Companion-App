import { Injectable, NotFoundException, /*StreamableFile, UploadedFile, UseInterceptors*/ } from '@nestjs/common';
// import { FileInterceptor } from '@nestjs/platform-express';
// import { createReadStream } from 'fs';
import fs = require('fs');
// import { join } from 'path';
import { Script, ScriptDocument } from '../../schemas/script.schema';
import mongoose, {  Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { listenerCount } from 'process';


@Injectable()
export class ScriptEditorService {
    constructor(@InjectModel(Script.name)private metadataModel: Model<ScriptDocument> ){}
    async saveFile(id:string, filename:string,content:string) : Promise<boolean>{
        return true;
        // console.log(new mongoose.Types.ObjectId(id));
        // //if you find one, update it with two , upsert: if you find it great else create it 
        // const saved = await this.metadataModel.findOne({_id:id});
        
        // console.log(!saved);
        
        // for(let i=0; i < saved.files.length; i++){
        //     if(saved.files[i].name==filename){
        //         fs.writeFile(saved.files[i].location,content,(err)=>{
        //             if(err)
        //                 console.log(err);
        //         });
        //     }
        // }
        // if(saved)
        //     return true;
        // else
        //     return false; 

    }

    async FileContent(id: string, filename: string ) : Promise<string>{
        return "";
        // if(id==""){
        //     throw new NotFoundException("NO AUTHOR PROVIDED");
        // }
        // if(filename==""){
        //     throw new NotFoundException("NO FILE NAME PROVIDED");
        // }
        // const found = await this.metadataModel.findOne({_id:id});

        // let content = "";
        // for(let i=0; i < found.files.length; i++){
        //     if(found.files[i].name==filename){
        //        content = fs.readFileSync(found.files[i].location,"utf-8")
        //     }
        // }
        // return content;
    }
}
