import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { AutomataScript, AutomataScriptDocument } from '../../schemas/automata-script.schema';
import { user } from '../../models/general/user';

@Injectable()
export class AutomataService {
    constructor(@InjectModel(AutomataScript.name) private automataModel: Model<AutomataScriptDocument> ){}

    async getAll():Promise<AutomataScript[]>{
        return this.automataModel.find({});
    }

    async getAutomataScript(name:string,author:user):Promise<AutomataScript>{
        return this.automataModel.findOne({"name" : name,"author.name" : author.name,"author.email" : author.email});
    }
}
