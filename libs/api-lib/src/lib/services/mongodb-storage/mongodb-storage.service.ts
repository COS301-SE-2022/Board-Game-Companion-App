import { Injectable } from '@nestjs/common';
import { upload } from '../../models/general/upload';
import fs = require("fs");
import { InjectModel } from '@nestjs/mongoose';
import { File, FileDocument } from '../../schemas/file.schema';
import { Model } from 'mongoose';
import { fileDto } from '../../models/dto/fileDto';
import { fileType } from '../../models/general/fileType';

@Injectable()
export class MongoDbStorageService{
    constructor(@InjectModel(File.name) private fileModel: Model<FileDocument>){}

    async retrieve(key:string): Promise<FileDocument>{
        return this.fileModel.findById(key);
    }

    async upload(name:string,type:fileType,data:string[]): Promise<upload>{

        const dto:fileDto = {
            name: name,
            type: type,
            data: data
        }
        
        const createdFile = new this.fileModel(dto);
        const savedFile:FileDocument =  await createdFile.save();
        
        const result:upload = {
            key : savedFile._id,
            location: (process.env.PROJECT_STATUS == "production" ? process.env.API_DOMAIN_PROD  : process.env.API_DOMAIN_DEV) + "api/files/" + savedFile._id + "/" + name
        }

        return result
    }

    async update(key:string, data:string[]): Promise<boolean>{
        const file = await this.fileModel.findById(key);
        
        if(file === null || file === undefined)
            return false;
        
        try{
            file.data = data;
            await file.save();
        }catch(err){
            return false;
        }
    }

    async remove(key:string): Promise<boolean>{
        const file = await this.fileModel.findByIdAndRemove(key);
        return file !== null && file !== undefined;
    }

    async copy(sourceKey:string):Promise<upload>{
        const file = await this.fileModel.findById(sourceKey);

        if(file === null || file === undefined)
            return null;

        const dto:fileDto = {
            name: file.name,
            type: file.type,
            data: file.data
        };

        const createdFile = new this.fileModel(dto);
        const savedFile:FileDocument =  await createdFile.save();
        
        const result:upload = {
            key : savedFile._id,
            location: (process.env.PROJECT_STATUS == "production" ? process.env.API_DOMAIN_PROD  : process.env.API_DOMAIN_DEV) + "api/files/" + savedFile._id + "/" + file.name
        }

        return result;
    }
}
