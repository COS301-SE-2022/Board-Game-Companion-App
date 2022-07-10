import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type LikeDocument = Like & Document;

@Schema()
export class Like{
    @Prop({required: true})
    comment: string;

    @Prop({required: true})
    user: string;

    @Prop({required: true})
    like: boolean;
}

export const LikeSchema = SchemaFactory.createForClass(Like);