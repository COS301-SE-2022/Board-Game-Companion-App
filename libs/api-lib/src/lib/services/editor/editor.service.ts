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
    private readonly localStorage: LocalStorageService,
    private readonly httpService: HttpService){
        
    }

    async updateBuild(id:string,compiledCode:string): Promise<{status:boolean,script:MyScript}>{
        let status = true;
        const path = "scripts/" + id + "/build/";
        const script:MyScriptDocument = await this.myScriptModel.findById(id).exec();
        
        try{
            //const fileUploadResult = await this.s3Service.upload("main.js",path,compiledCode);
            const fileUploadResult = await this.localStorage.upload("main.js",path,compiledCode)
            script.build = {
                name:"main.js",
                location:fileUploadResult.location,
                key:fileUploadResult.key
            };

            script.size = await fileSize(script.build.location).catch(console.error);
    
            script.save();
        }catch(e){
            status = false;
        }


        return {status:status,script:script};
    }

    async updateModels(script:string,networks:string[]):Promise<MyScript>{
        const result:MyScriptDocument = await this.myScriptModel.findById(script);
        let size = 0;

        if(result === null || undefined)
            throw new HttpException('Script Not Found', HttpStatus.NOT_FOUND);

        for(let count = 0; count < networks.length; count++){
            const value = networks[count];
            const temp = await this.networksModel.findById(value);
            
            if(temp === null || undefined)
                throw new HttpException(`Model with id ${value} does not exist`,HttpStatus.BAD_REQUEST);
            
            size += await fileSize(temp.model.location).catch(console.error);
            size += await fileSize(temp.weights.location).catch(console.error);
        }

        result.models = networks;

        result.size = size;
        result.size += await fileSize(result.build.location).catch(console.error);
        result.size += await fileSize(result.icon.location).catch(console.error);

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
                const compilerResult = this.compilerService.transpile(content);
                const err = compilerResult as errResult;
                const compiledCode = compilerResult as programResult;
                if(err.err)
                {
                    throw new Error(err.err);
                }
                result = {status:"success",message:"successfully updated script on " + (new Date()).toString(),programStructure:compiledCode.programStructure};
                
                
                const data:string  = (await this.httpService.axiosRef.get(script.source.location,{
                    responseType:'text'
                })).data;

                if(data !== content){
                    script.status.value = 1;
                    script.lastUpdate = new Date();
                }

                await this.updateBuild(id,compiledCode.build);
                //this.s3Service.update(script.source.key,content);
                await this.localStorage.update(script.source.key,content);
                
                script.programStructure = compiledCode.programStructure;



                script.save();
            
            }catch(e){
                //console.log(e);
                result = {status:"failed",message:e};
            }
        }
        //console.log(result)
        return result;
    }
}
