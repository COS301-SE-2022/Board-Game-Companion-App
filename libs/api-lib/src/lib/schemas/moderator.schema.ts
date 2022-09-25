import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { user } from '../models/general/user';

export type ModeratorDocument = Moderator & Document;

@Schema()
export class Moderator{
    
    @Prop({required: true})
    email: string;

    @Prop({required:true})
    admin: boolean;

}

export const ModeratorSchema = SchemaFactory.createForClass(Moderator);