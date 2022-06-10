import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Script } from './script.schema';

export type RatingDocument = Rating & Document;

@Schema()
export class Rating{
    @Prop({required: true})
    user: string;

    @Prop({required: true,type:mongoose.Schema.Types.ObjectId, ref:'Script'})
    script: Script;

    @Prop({required: true})
    value: number;
}

export const RatingSchema = SchemaFactory.createForClass(Rating);