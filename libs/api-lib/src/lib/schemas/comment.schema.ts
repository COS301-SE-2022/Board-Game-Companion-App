import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { user } from '../models/general/user';

export type CommentDocument = Comment & Document;

@Schema()
export class Comment{
    @Prop({required:true,type:{name:"",email:""}})
    user: user;

    @Prop({required: true})
    image: string;

    @Prop({required: true})
    created: Date;

    @Prop({required: true})
    script: string;

    @Prop({required:true})
    content: string;

    @Prop({type: [{type:mongoose.Schema.Types.ObjectId,ref:'Comment'}]})
    replies: string[]; 
}

export const CommentSchema = SchemaFactory.createForClass(Comment);