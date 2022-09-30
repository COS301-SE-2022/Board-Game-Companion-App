import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { user } from '../models/general/user';

export type CollectionDocument = Collection & Document;

@Schema()
export class Collection{
    
    @Prop({required:true,type:{name:"",email:""}})
    owner: user;

    @Prop({required: true})
    name: string;

    @Prop({required: true})
    boardgames: string[]
}

export const CollectionSchema = SchemaFactory.createForClass(Collection);