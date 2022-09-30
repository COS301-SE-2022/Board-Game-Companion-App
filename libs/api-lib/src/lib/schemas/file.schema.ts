import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { user } from '../models/general/user';

export type FileDocument = File & Document;

@Schema()
export class File{
    @Prop({required:true})
    name: string;
    
    @Prop({required:true})
    mimeType: string;

    @Prop()
    data: string;
}

export const FileSchema = SchemaFactory.createForClass(File);