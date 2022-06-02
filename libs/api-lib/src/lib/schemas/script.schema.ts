import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Comment } from './comment.schema';

export type ScriptDocument = Script & Document;

@Schema()
export class Script{
    @Prop({required: true})
    name: string;

    @Prop({required:true})
    author: string;

    @Prop({required:true})
    boardgame: string;

    @Prop({required:true})
    published: Date;

    @Prop()
    downloads: number;

    @Prop()
    lastdownload: Date;

    @Prop({required:true})
    public: boolean;
    
    @Prop({required: true})
    size: number;

    @Prop({type: [{type: mongoose.Schema.Types.ObjectId,ref: 'Owner'}]})
    comments: Comment[];

    @Prop({required:true})
    path: string;

    @Prop()
    avatar: string; 
}

export const ScriptSchema = SchemaFactory.createForClass(Script);