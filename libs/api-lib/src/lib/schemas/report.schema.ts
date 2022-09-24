import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { user } from '../models/general/user';

export type ReportDocument = Report & Document;

@Schema()
export class Report{

    @Prop({required:true,type:{name:"",email:""}})
    user: user;

    @Prop({required:true})
    script: boolean;
    
    @Prop({required:true})
    link: string;

    @Prop({required: true})
    message: string;

    @Prop({required: true})
    dateIssued: Date;
}

export const ReportSchema = SchemaFactory.createForClass(Report);