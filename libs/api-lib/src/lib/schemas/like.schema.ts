import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { user } from '../models/general/user';

export type LikeDocument = Like & Document;

@Schema()
export class Like{
    @Prop({required: true})
    comment: string;

    @Prop({required:true,type:{name:"",email:""}})
    user: user;

    @Prop({required: true})
    like: boolean;
}

export const LikeSchema = SchemaFactory.createForClass(Like);