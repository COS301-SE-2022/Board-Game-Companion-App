import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type CommentDocument = Comment & Document;

@Schema()
export class Comment{
    @Prop({required: true})
    user: string;

    @Prop()
    time: number;

    @Prop()
    published: Date;

    @Prop({required:true})
    likes: number;

    @Prop({required:true})
    dislikes: number;

    @Prop({required:true})
    content: string;

    @Prop({type: [{type:mongoose.Schema.Types.ObjectId,ref:'Comment'}]})
    replies: Comment[]; 
}

export const CommentSchema = SchemaFactory.createForClass(Comment);