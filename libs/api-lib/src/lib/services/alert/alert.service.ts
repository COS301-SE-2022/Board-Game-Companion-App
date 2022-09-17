import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Alert, AlertDocument } from '../../schemas/alert.schema';
import mongoose from 'mongoose';
import { user } from '../../models/general/user';
import { AutomataScript, AutomataScriptDocument } from '../../schemas/automata-script.schema';
import { OldScript, OldScriptDocument } from '../../schemas/old-script.schema';
import { create } from 'domain';
import { string } from '@tensorflow/tfjs';
import { alertType } from '../../models/general/alertType';
import { userInfo } from 'os';
import { alertDto } from '../../models/dto/alertDto';

@Injectable()
export class AlertService {
    constructor(@InjectModel(Alert.name) private readonly alertModel: Model<AlertDocument>,
                @InjectModel(AutomataScript.name) private readonly automataModel: Model<AutomataScriptDocument>,
                @InjectModel(OldScript.name) private readonly oldModel: Model<OldScriptDocument>){}

    

    async create(recepient:user,link:string,type:alertType):Promise<AlertDocument>{
        const dto:alertDto = {
            recepient:recepient,
            date: new Date(),
            link:link,
            alertType:type,
            read:false
        }

        const created = new this.alertModel(dto);
        return created.save();
    }

    async getAllUserMessages(recepient:user):Promise<AlertDocument[]>{
        return this.alertModel.find({"recepient.name":recepient.name,"recepient.email":recepient.email});
    }

    async markAsRead(id:string):Promise<AlertDocument>{
        const result = await this.alertModel.findById(id);
        
        if(result === null || result === undefined)
            return null;

        result.read = true;

        await result.save();
        return result;
    }
}