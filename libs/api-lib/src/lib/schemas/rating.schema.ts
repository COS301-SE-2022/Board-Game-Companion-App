import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { user } from '../models/general/user';

export type RatingDocument = Rating & Document;

@Schema()
export class Rating{
    @Prop({required:true,type:{name:"",email:""}})
    user: user;

    @Prop({required: true,type:mongoose.Schema.Types.ObjectId, ref:'Script'})
    script: string;

    @Prop({required: true})
    value: number;
}

export const RatingSchema = SchemaFactory.createForClass(Rating);