import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DownloadScript, DownloadScriptDocument } from '../../schemas/download-script.schema';
import { user } from '../../models/general/user';
import { version } from '../../models/general/version';
import { HttpService } from '@nestjs/axios';
import { AutomataScript, AutomataScriptDocument } from '../../schemas/automata-script.schema';
import { OldScript, OldScriptDocument } from '../../schemas/old-script.schema';
import { update } from '../../models/general/update';
import fs = require('fs');
import { ModelsService } from '../models/models.service';
import { NeuralNetworkDiscriminator } from '../../models/general/modelDiscriminator';
import { NeuralNetwork, NeuralNetworkDocument } from '../../schemas/neural-network.schema';
import { MongoDbStorageService } from '../mongodb-storage/mongodb-storage.service';

@Injectable()
export class DownloadsService {
    constructor(@InjectModel(DownloadScript.name) private downloadsModel:Model<DownloadScriptDocument>,
                @InjectModel(AutomataScript.name) private automataModel: Model<AutomataScriptDocument>,
                @InjectModel(OldScript.name) private oldModel: Model<OldScriptDocument>,
                private readonly httpService: HttpService,
                private readonly modelService: ModelsService,
                private readonly storageService: MongoDbStorageService
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
        oldScript.link = newScript._id;
        
        const buildCopy = await this.storageService.copy(newScript.build.key);
        oldScript.build.key = buildCopy.key;
        oldScript.build.location = buildCopy.location;

        for(let count = 0; count < oldScript.models.length; count++){
            const value = oldScript.models[count];
            const model = await this.modelService.removeById(value);

            if(model !== null || model !== undefined){
                this.storageService.remove(model.model.key);
                this.storageService.remove(model.weights.key);
            }
        }

        oldScript.models = [];
        for(let count = 0; count < newScript.models.length; count++){
            const value = newScript.models[count];
            const modelCopy = await this.modelService.copyModel(value,NeuralNetworkDiscriminator.DownloadScript);
            
            if(modelCopy !== "")
                oldScript.models.push(modelCopy);
        }

        newScript.downloads++;
        newScript.lastDownload = new Date();

        await newScript.save();
        await oldScript.save();

        return oldScript;
    }

    async getDownloadInfo(id:string):Promise<AutomataScript | OldScript>{
        const automata = await this.automataModel.findById(id);

        if(automata !== null && automata !== undefined)
            return automata;

        const old = await this.oldModel.findById(id);

        if(old !== null && old !== undefined)
            return old;

        return null;
    }

    async getMyDownloads(owner:user):Promise<DownloadScript[]>{
        return this.downloadsModel.find({"owner.name":owner.name,"owner.email":owner.email});
    }
    
    async getAll():Promise<DownloadScript[]>{
        return this.downloadsModel.find({});
    }

    async retrieveById(id:string):Promise<DownloadScript>{
        return this.downloadsModel.findById(id).exec();
    }

    async removeScript(id:string):Promise<void>{
        const script = await this.downloadsModel.findByIdAndRemove(id);
        
        if(script === null || script === undefined)
            return;

        this.modelService.getModelsByIdOnly(script.models).then((networks:NeuralNetwork[])=>{
            networks.forEach((network:NeuralNetwork) => {
                fs.unlinkSync(network.model.key);
                fs.unlinkSync(network.weights.key);
            })
        });

        script.models.forEach((value:string) => {
            this.modelService.removeById(value);
        })
    }
}
