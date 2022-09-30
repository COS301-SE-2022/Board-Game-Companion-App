import { Injectable } from '@nestjs/common';
import { upload } from '../../models/general/upload';
import fs = require("fs");
import { InjectModel } from '@nestjs/mongoose';
import { File, FileDocument } from '../../schemas/file.schema';
import { Model } from 'mongoose';
import { fileDto } from '../../models/dto/fileDto';

@Injectable()
export class MongoDbStorageService{
    constructor(@InjectModel(File.name) private fileModel: Model<FileDocument>){}

    async retrieve(key:string): Promise<FileDocument>{
        return this.fileModel.findById(key);
    }

    async upload(name:string,type:string,data:any): Promise<upload>{

        const dto:fileDto = {
            name: name,
            mimeType: type,
            data: Buffer.from(data).toString('base64')
        }
        
        const createdFile = new this.fileModel(dto);
        const savedFile:FileDocument =  await createdFile.save();
        
        const result:upload = {
            key : savedFile._id,
            location: (process.env.PROJECT_STATUS == "production" ? process.env.API_DOMAIN_PROD  : process.env.API_DOMAIN_DEV) + "api/files/" + savedFile._id
        }

        return result
    }

    async update(key:string,data:string): Promise<boolean>{
        const file = await this.fileModel.findById(key);
        
        if(file === null || file === undefined)
            return false;
        
        try{
            file.data = Buffer.from(data).toString('base64');
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
            mimeType: file.mimeType,
            data: file.data
        };

        const createdFile = new this.fileModel(dto);
        const savedFile:FileDocument =  await createdFile.save();
        
        const result:upload = {
            key : savedFile._id,
            location: (process.env.PROJECT_STATUS == "production" ? process.env.API_DOMAIN_PROD  : process.env.API_DOMAIN_DEV) + "api/files/" + savedFile._id
        }

        return result;
    }
}
