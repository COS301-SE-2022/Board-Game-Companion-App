import { user } from '../general/user';
import { file } from "../general/file";
import { version } from "../scripts/version";

export class baseScript{
    name = "";
    author: user = {name:"",email:""};
    boardgame = "";
    description = "";
    version:version = {major:0,minor:0,patch:0};
    size = 0;
    icon: file = {name:"",location:"",key:""};
    build: file = {name:"",location:"",key:""};
    models: string[] = [];
}