import { Injectable ,HttpException , HttpStatus } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { AutomataScript, AutomataScriptDocument } from '../../schemas/automata-script.schema';
import { OldScript, OldScriptDocument } from '../../schemas/old-script.schema';
import { DownloadScript, DownloadScriptDocument } from '../../schemas/download-script.schema';
import { user } from '../../models/general/user';
import fs = require('fs');
import { ModelsService } from '../models/models.service';
import { downloadScriptDto } from '../../models/dto/downloadScriptDto';
import { NeuralNetworkDiscriminator } from '../../models/general/modelDiscriminator'
import { version } from '../../models/general/version';
import { MongoDbStorageService } from '../mongodb-storage/mongodb-storage.service';

@Injectable()
export class AutomataService {
    constructor(@InjectModel(AutomataScript.name) private automataModel: Model<AutomataScriptDocument>,
                @InjectModel(OldScript.name) private oldModel: Model<OldScriptDocument>,
                @InjectModel(DownloadScript.name) private downloadModel: Model<DownloadScriptDocument>,
                private readonly modelService:ModelsService,
                private readonly storageService:MongoDbStorageService){}

    async getAll():Promise<AutomataScript[]>{
        return this.automataModel.find({});
    }

    async getByGame(id:string):Promise<AutomataScript[]>{
        return this.automataModel.find({"boardgame":id});
    }

    async download(id:string,owner:user):Promise<DownloadScript>{
        let script = await this.automataModel.findById(id);

        if(script === null || script === undefined){
           script = await this.oldModel.findById(id);
           
           if(script === null || script === undefined)
               return null;
        }

        const dto:downloadScriptDto = {
            link: script._id,
            name: script.name,
            author: {
                name: script.author.name,
                email: script.author.email
            },
            boardgame: script.boardgame,
            description: script.description,
            version: {
                major: script.version.major,
                minor: script.version.minor,
                patch: script.version.patch
            },
            size: script.size,
            icon: {name:"",key:"",location:""},
            build: {name:"",key:"",location:""},
            models: [],
            owner: owner,
            dateDownloaded: new Date(),
            iconSize: script.iconSize
        }

        const createdScript = new this.downloadModel(dto);
        const result:DownloadScriptDocument =  await createdScript.save();
        
        //const buildCopy = this.localStorage.copy(script.build.key,"scripts/download-scripts/" + result._id + "/build/",script.build.name);
        
        const buildCopy = await this.storageService.copy(script.build.key);
        result.build = {
            name: script.build.name,
            location: buildCopy.location,
            key: buildCopy.key
        }

        //const iconCopy = this.localStorage.copy(script.icon.key,"scripts/download-scripts/" + result._id + "/icons/",script.icon.name);
        
        const iconCopy = await this.storageService.copy(script.icon.key);
        result.icon = {
            name: script.icon.name,
            location: iconCopy.location,
            key: iconCopy.key
        }

        for(let count = 0; count < script.models.length; count++){
            const value = script.models[count];
            const modelCopy = await this.modelService.copyModel(value,NeuralNetworkDiscriminator.DownloadScript);
            
            if(modelCopy !== "")
                result.models.push(modelCopy);
        }

        script.downloads++;
        script.lastDownload = new Date();

        await script.save();
        await result.save();

        return result;
    }

    async getOldVersions(idList:string[]):Promise<OldScript[]>{
        return this.oldModel.find().where('_id').in(idList);
    }

    async getAutomataScript(name:string,author:user):Promise<AutomataScriptDocument>{
        return this.automataModel.findOne({"name" : name,"author.name" : author.name,"author.email" : author.email});
    }

    async addComment(scriptId:string,commentId:string): Promise<void>{
        let script = await this.automataModel.findById(scriptId);
        
        if(script === null || script === undefined){
            script = await this.oldModel.findById(scriptId);
            
            if(script === null || script === undefined)
                return;
        }

        script.comments.unshift(commentId);
        
        script.save();
    }

    async getScriptById(id:string):Promise<AutomataScript>{
        return this.automataModel.findById(id);
    }

    async remove(id:string):Promise<void>{
        const script = await this.automataModel.findByIdAndRemove(id);
        this.storageService.remove(script.source.key);
        this.storageService.remove(script.build.key);
        this.storageService.remove(script.icon.key);
        
        for(let count = 0; count < script.models.length; count++){
            const value = script.models[count];
            const model = await this.modelService.removeById(value);

            if(model !== null || model !== undefined){
                this.storageService.remove(model.model.key);
                this.storageService.remove(model.weights.key);
            }
        }
    }

    checkVersion(oldVersion:version,newVersion:version): boolean{
        let result = true;
    
        if(newVersion.major < oldVersion.major){
          result = false;
        }else if(newVersion.major === oldVersion.major){
          if(newVersion.minor < oldVersion.minor){
            result = false;
          }else if(newVersion.minor === oldVersion.minor){
            if(newVersion.patch <= oldVersion.patch)
              result = false;
          }
        }
    
        return result;
      }

    async checkForUpdatesForOne(id:string):Promise<string>{
        const temp = await this.automataModel.find({});
        for(let count = 0; count < temp.length; count++){
            if(temp[count].previous.includes(id)){
                return temp[count]._id;
            }
        }

        return "";
    }
}
