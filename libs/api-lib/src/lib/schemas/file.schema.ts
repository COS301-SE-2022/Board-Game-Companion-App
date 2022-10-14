import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type FileDocument = File & Document;

@Schema()
export class File{
    @Prop({required: true})
    name: string;

    @Prop({required: true})
    type: number;

    @Prop({required: true})
    data: string[];
}

export const FileSchema = SchemaFactory.createForClass(File);