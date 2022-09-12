import { Controller,  Get, Param, HttpException, HttpStatus, Res, StreamableFile } from '@nestjs/common';
import { MongoDbStorageService } from '../../services/mongodb-storage/mongodb-storage.service';
import fs = require('fs');

@Controller('files')
export class ApiFileManagerController {
    constructor(private readonly storageService:MongoDbStorageService){}
    
    @Get(':key')
    async getFile(@Param('key')key:string): Promise<StreamableFile>{
        const file = await this.storageService.retrieve(key);

        if(file !== null){
            
            const tempPath = "temporary/" + file._id + "/";

            fs.mkdirSync(tempPath,{recursive: true});
            fs.writeFileSync(tempPath + file.name,file.data,{encoding: 'base64'});
            const tempFile = fs.createReadStream(tempPath + file.name);

            return new StreamableFile(tempFile);
        }else
            throw new HttpException("Not Found",HttpStatus.NOT_FOUND);
        
        return; 
    }
}
