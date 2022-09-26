import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { NeuralNetwork, NeuralNetworkDocument } from '../../schemas/neural-network.schema';
import { S3Service } from '../aws/s3.service';
import { CompilerService } from '../compiler/compiler.service';
import fileSize = require("url-file-size");
import { user } from '../../models/general/user';
import { HttpService } from '@nestjs/axios';
import { LocalStorageService } from '../local-storage/local-storage.service';
import { entity } from '../../models/general/entity';
import { MyScript, MyScriptDocument } from '../../schemas/my-script.schema';
import { MongoDbStorageService } from '../mongodb-storage/mongodb-storage.service';

interface programResult{
    build:string;
    programStructure:entity;
}
interface errResult{
    err:string;
}

@Injectable()
export class EditorService {
    months:string[] = ["January","February","March","April","May","June","July","August","September","October","November","December"];
    
    constructor(@InjectModel(MyScript.name) private myScriptModel: Model<MyScriptDocument>,
    @InjectModel(NeuralNetwork.name) private networksModel: Model<NeuralNetworkDocument>,
    private readonly s3Service:S3Service,
    private readonly compilerService:CompilerService,
    private readonly httpService: HttpService,
    private readonly storageService:MongoDbStorageService){
        
    }

    async updateBuild(id:string,compiledCode:string): Promise<void>{
        let status = true;
        const script:MyScriptDocument = await this.myScriptModel.findById(id).exec();
        
        try{
            await this.storageService.update(script.build.key,compiledCode);
            await script.save();
        }catch(e){
            status = false;
        }

    }

    async updateModels(script:string,networks:string[]):Promise<MyScript>{
        const result:MyScriptDocument = await this.myScriptModel.findById(script);

        if(result === null || undefined)
            throw new HttpException('Script Not Found', HttpStatus.NOT_FOUND);

        for(let count = 0; count < networks.length; count++){
            const value = networks[count];
            const temp = await this.networksModel.findById(value);
            
            if(temp === null || undefined)
                throw new HttpException(`Model with id ${value} does not exist`,HttpStatus.BAD_REQUEST);

        }

        result.models = networks;

        result.save();

        return result;
    }


    async updateFile(id:string,content:string):Promise<any>{
        const script:MyScriptDocument = await this.myScriptModel.findById(id);
        let result:any = {status:"success",message:""}

        if(script === null)
            result = {status:"failed",message: "invalid script id"};
        else{
            try{
                const compiledCode = this.compilerService.transpile(content);

                result = {
                            status: "success",
                            message: "successfully updated script on " + (new Date()).toString(),
                            programStructure: compiledCode.programStructure
                        };
                
                
                const data:string  = (await this.httpService.axiosRef.get(script.source.location,{
                    responseType:'text'
                })).data;

                if(data !== content){
                    script.status.value = 1;
                    script.lastUpdate = new Date();
                }

                await this.updateBuild(id,compiledCode.build);
                await this.storageService.update(script.source.key,content);
                
                script.programStructure = compiledCode.programStructure;
                script.size = script.iconSize + compiledCode.build.length + content.length;

                script.save();
            
            }catch(e){
                result = {status:"failed",message:e};
            }
        }
        
        return result;
    }
}
