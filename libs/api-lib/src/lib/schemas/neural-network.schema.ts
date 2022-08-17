import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { user } from '../models/general/user';

export type NeuralNetworkDocument = NeuralNetwork & Document;

@Schema()
export class NeuralNetwork{
    @Prop({required:true,type:{name:"",email:""}})
    user: user;

    @Prop({required: true})
    name: string;

    @Prop({required: true})
    created: Date;

    @Prop()
    accuracy: number;

    @Prop()
    loss: number;

    @Prop({required: true})
    type: string;

    @Prop()
    labels: number[];

    @Prop()
    min: number[];

    @Prop()
    max: number[];
}

export const NeuralNetworkSchema = SchemaFactory.createForClass(NeuralNetwork);