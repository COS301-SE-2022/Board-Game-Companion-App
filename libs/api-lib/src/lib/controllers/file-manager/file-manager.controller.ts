import { Controller,  Get, Param, HttpException, HttpStatus, Res, StreamableFile } from '@nestjs/common';
import { MongoDbStorageService } from '../../services/mongodb-storage/mongodb-storage.service';
import fs = require('fs');
import { fileType } from '../../models/general/fileType';

@Controller('files')
export class ApiFileManagerController {
    constructor(private readonly storageService:MongoDbStorageService){}
    
    @Get(':key/:name')
    async getFile(@Param('key')key:string,@Param('name')name:string): Promise<StreamableFile>{
        const file = await this.storageService.retrieve(key);
        if(file !== null){
            const tempPath = "temporary/" + file._id + "/";

            fs.mkdirSync(tempPath,{recursive: true});

            if(file.type === fileType.text){
                fs.writeFileSync(tempPath + file.name,file.data[0].toString());
            }else if(file.type === fileType.image){
                fs.writeFileSync(tempPath + file.name,file.data[0],{encoding:'base64'});
            }else if(file.type === fileType.model){
                if(name === "model.json")
                    fs.writeFileSync(tempPath + name,file.data[0],{encoding:'base64'});
                
                if(name === "model.weights.bin")
                    fs.writeFileSync(tempPath + name,file.data[1],{encoding:'base64'});
            }

            
            const tempFile = fs.createReadStream(tempPath + file.name);

            return new StreamableFile(tempFile);
        }else{
            throw new HttpException("Not Found",HttpStatus.NOT_FOUND);
        }

        return;
    }
}
