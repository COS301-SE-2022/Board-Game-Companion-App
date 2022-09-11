import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { file } from '../models/general/files';
import { baseScript } from './base-script';
export type OldScriptDocument = OldScript & Document;

@Schema()
export class OldScript extends baseScript{
    @Prop({required: true})
    dateReleased: Date;

    @Prop({required: true})
    downloads: number;

    @Prop()
    lastDownload: Date;
    
    @Prop({required: true})
    export: boolean;

    @Prop({type: [{type: mongoose.Schema.Types.ObjectId,ref: 'Owner'}]})
    comments: string[];

    @Prop({required: true})
    rating: number;
    
    @Prop({required:true,type:{name:"",key:"",location:""}})
    source: file;
}

export const OldScriptSchema = SchemaFactory.createForClass(OldScript);