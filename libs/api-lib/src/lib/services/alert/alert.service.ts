import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Alert, AlertDocument } from '../../schemas/alert.schema';
import { user } from '../../models/general/user';
import { AutomataScript, AutomataScriptDocument } from '../../schemas/automata-script.schema';
import { OldScript, OldScriptDocument } from '../../schemas/old-script.schema';
import { alertType } from '../../models/general/alertType';
import { alertDto } from '../../models/dto/alertDto';
import {WebSocketGateway, WebSocketServer, SubscribeMessage, OnGatewayConnection, OnGatewayDisconnect} from '@nestjs/websockets';
import { Server } from 'http';

@WebSocketGateway()
@Injectable()
export class AlertService {
    @WebSocketServer()server: Server;

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
        
        const result = await created.save();
        this.server.emit("alert." + result.recepient.name + "." + result.recepient.email,result);
        return result;
    }

    async getAllUserMessages(recepient:user):Promise<AlertDocument[]>{
        return this.alertModel.find({"recepient.name":recepient.name,"recepient.email":recepient.email});
    }

    async getAllUnReadUserMessages(recepient:user):Promise<AlertDocument[]>{
        return this.alertModel.find({"recepient.name":recepient.name,"recepient.email":recepient.email,"read":false});
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