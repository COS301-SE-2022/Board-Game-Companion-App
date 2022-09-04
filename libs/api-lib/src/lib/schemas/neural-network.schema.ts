import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { file } from '../models/general/files';
import { user } from '../models/general/user';
import { NeuralNetworkDiscriminator } from '../models/general/modelDiscriminator';
export type NeuralNetworkDocument = NeuralNetwork & Document;

@Schema()
export class NeuralNetwork{
    @Prop({required:true,type:{name:"",email:""}})
    creator: user;

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
    labels: string[];

    @Prop()
    min: number[];

    @Prop()
    max: number[];

    @Prop({required:true,type:{name:"",key:"",location:""}})
    model: file;

    @Prop({required:true,type:{name:"",key:"",location:""}})
    weights: file;

    @Prop({required:true})
    discriminator: number
}

export const NeuralNetworkSchema = SchemaFactory.createForClass(NeuralNetwork);