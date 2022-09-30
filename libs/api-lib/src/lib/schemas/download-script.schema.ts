import { baseScript } from './base-script';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { user } from '../models/general/user';

export type DownloadScriptDocument = DownloadScript & Document;

@Schema()
export class DownloadScript extends baseScript{
    @Prop({required: true,type:{name:"",email:""}})
    owner: user;

    @Prop({required: true})
    link: string;
    
    @Prop({required: true})
    dateDownloaded: Date;
}

export const DownloadScriptSchema = SchemaFactory.createForClass(DownloadScript);