import { baseScript } from './base-script';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { file } from '../models/general/files';
import { status as stat} from '../models/general/status';
import { emptyEntity, entity } from '../models/general/entity';
import { user } from '../models/general/user';

export type MyScriptDocument = MyScript & Document;

@Schema()
export class MyScript extends baseScript{
    @Prop({required: true})
    created: Date;

    @Prop({required: true})
    lastUpdate: Date;

    @Prop({type:{value:0,message:""}})
    status:stat;
    
    @Prop({required: true})
    export: boolean;

    @Prop({required:true,type:emptyEntity})
    programStructure:entity;

    @Prop({required:true,type:{name:"",key:"",location:""}})
    source: file;
}

export const MyScriptSchema = SchemaFactory.createForClass(MyScript);