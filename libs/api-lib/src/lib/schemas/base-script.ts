import { user } from '../models/general/user';
import { file } from "../models/general/files";
import { version } from "../models/general/version";
import { Prop, Schema } from '@nestjs/mongoose';


@Schema()
export class baseScript{
    @Prop({required: true})
    name: string;

    @Prop({required: true,type:{name:"",email:""}})
    author: user
    
    @Prop({required: true})
    boardgame: string;
    
    @Prop({required: true})
    description: string;
    
    @Prop({required: true,type:{major:0,minor:0,patch:0}})
    version: version;
    
    @Prop({required: true})
    size: number;
    
    @Prop({required: true,type:{name:"",key:"",location:""}})
    icon: file;
    
    @Prop({required: true,type:{name:"",key:"",location:""}})
    build: file;
    
    @Prop()
    models: string[];

    @Prop({required:true})
    iconSize: number;
}