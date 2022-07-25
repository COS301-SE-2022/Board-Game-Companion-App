import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { file } from '../models/general/files';
import { status as stat} from '../models/general/status';
import { Comment } from './comment.schema';

export type ScriptDocument = Script & Document;

@Schema()
export class Script{

    @Prop({required: true})
    name: string;

    @Prop({required:true})
    author: string;

    @Prop({required:true})
    boardgame: string;

    @Prop({required:true})
    description: string;

    @Prop({required:true})
    created: string;

    @Prop()
    lastupdate: Date;

    @Prop({type:{value:0,message:""}})
    status:stat;

    @Prop()
    release: Date;

    @Prop()
    downloads: number;

    @Prop()
    lastdownload: Date;

    @Prop({required:true})
    public: boolean;
    
    @Prop({required:true})
    export: boolean;

    @Prop({required: true})
    size: number;

    @Prop({type: [{type: mongoose.Schema.Types.ObjectId,ref: 'Owner'}]})
    comments: string[];

    @Prop({required:true,type:{name:"",awsKey:"",location:""}})
    source: file;

    @Prop({required:true,type:{name:"",awsKey:"",location:""}})
    build: file;

    @Prop()
    icon: string; 
}

export const ScriptSchema = SchemaFactory.createForClass(Script);