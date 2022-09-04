import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { AutomataScript, AutomataScriptDocument } from '../../schemas/automata-script.schema';
import { OldScript, OldScriptDocument } from '../../schemas/old-script.schema';
import { user } from '../../models/general/user';
import fs = require('fs');
import { ModelsService } from '../models/models.service';

@Injectable()
export class AutomataService {
    constructor(@InjectModel(AutomataScript.name) private automataModel: Model<AutomataScriptDocument>,
                @InjectModel(OldScript.name) private oldModel: Model<OldScriptDocument>,
                private readonly modelService:ModelsService){}

    async getAll():Promise<AutomataScript[]>{
        return this.automataModel.find({});
    }

    async getOldVersions(name:string,author:user):Promise<OldScript[]>{
        return this.oldModel.find({"name":name,"author.name":author.name,"author.email":author.email});
    }

    async getAutomataScript(name:string,author:user):Promise<AutomataScriptDocument>{
        return this.automataModel.findOne({"name" : name,"author.name" : author.name,"author.email" : author.email});
    }

    async addComment(scriptId:string,commentId:string): Promise<void>{
        const script:AutomataScriptDocument = await this.automataModel.findById(scriptId);
        
        script.comments.unshift(commentId);
        
        script.save();
    }

    async remove(id:string):Promise<void>{
        const script = await this.automataModel.findByIdAndRemove(id);
        fs.unlinkSync(script.source.key);
        fs.unlinkSync(script.build.key);
        fs.unlinkSync(script.icon.key);
        
        for(let count = 0; count < script.models.length; count++){
            const value = script.models[count];
            const model = await this.modelService.removeById(value);

            if(model !== null || model !== undefined){
                fs.unlinkSync(model.model.key);
                fs.unlinkSync(model.weights.key);
            }
        }
    }
}
