import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { user } from '../models/general/user';

export type BanDocument = Ban & Document;

@Schema()
export class Ban{
    @Prop({required:true,type:{name:"",email:""}})
    account: user;
}

export const BanSchema = SchemaFactory.createForClass(Ban);