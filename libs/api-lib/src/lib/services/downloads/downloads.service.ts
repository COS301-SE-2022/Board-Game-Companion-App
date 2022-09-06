import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DownloadScript, DownloadScriptDocument } from '../../schemas/download-script.schema';
import { user } from '../../models/general/user';
import { version } from '../../models/general/version';
import { HttpService } from '@nestjs/axios';
import { LocalStorageService } from '../local-storage/local-storage.service';
import { AutomataScript, AutomataScriptDocument } from '../../schemas/automata-script.schema';
import { update } from '../../models/general/update';
import fs = require('fs');
import { ModelsService } from '../models/models.service';
import { NeuralNetworkDiscriminator } from '../../models/general/modelDiscriminator';

@Injectable()
export class DownloadsService {
    constructor(@InjectModel(DownloadScript.name) private downloadsModel:Model<DownloadScriptDocument>,
                @InjectModel(AutomataScript.name) private automataModel: Model<AutomataScriptDocument>,
                private readonly httpService: HttpService,
                private readonly localStorage: LocalStorageService,
                private readonly modelService: ModelsService,
                ){}


    async alreadyDownloaded(owner:user,author:user,name:string,version:version):Promise<boolean>{
        const script =  await this.downloadsModel.findOne({   "owner.name": owner.name,
                                            "owner.email": owner.email,
                                            "author.name": author.name,
                                            "author.email": author.email,
                                            "name":name,
                                            "version.major":version.major,
                                            "version.minor":version.minor,
                                            "version.patch":version.patch
                                        });

        return script !== null && script !== undefined;
    }

    async update(ids:update):Promise<DownloadScript>{
        const oldScript = await this.downloadsModel.findById(ids.oldId);
        const newScript = await this.automataModel.findById(ids.newId);
        
        if(oldScript === null || newScript === null || oldScript === undefined || newScript === undefined)
            return null;
        
        oldScript.description = newScript.description;
        oldScript.version.major = newScript.version.major;
        oldScript.version.minor = newScript.version.minor;
        oldScript.version.patch = newScript.version.patch;
        oldScript.size = newScript.size;

        this.localStorage.copy(newScript.build.key,"scripts/download-scripts/" + oldScript._id + "/build/",oldScript.build.name);
        
        for(let count = 0; count < oldScript.models.length; count++){
            const value = oldScript.models[count];
            const model = await this.modelService.removeById(value);

            if(model !== null || model !== undefined){
                fs.unlinkSync(model.model.key);
                fs.unlinkSync(model.weights.key);
            }
        }

        oldScript.models = [];
        for(let count = 0; count < newScript.models.length; count++){
            const value = newScript.models[count];
            const modelCopy = await this.modelService.copyModel(value,NeuralNetworkDiscriminator.DownloadScript);
            
            if(modelCopy !== "")
                oldScript.models.push(modelCopy);
        }

        await oldScript.save();

        return oldScript;
    }

    async getMyDownloads(owner:user):Promise<DownloadScript[]>{
        return this.downloadsModel.find({"owner.name":owner.name,"owner.email":owner.email});
    }
    
    async retrieveById(id:string):Promise<DownloadScript>{
        return this.downloadsModel.findById(id).exec();
    }

    async removeScript(id:string){
        this.downloadsModel.findByIdAndRemove(id).exec();
    }
}
