import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { user } from '../models/general/user';

export type AlertDocument = Alert & Document;

@Schema()
export class Alert{
    
    @Prop({required:true,type:{name:"",email:""}})
    recepient: user;

    @Prop({required:true})
    date: Date;

    @Prop({required: true})
    link: string;

    @Prop({required: true})
    alertType: number;

    @Prop({required: true})
    read: boolean;
}

export const AlertSchema = SchemaFactory.createForClass(Alert);