import { file } from "../general/file";
import { user } from "../general/user";
import { version } from "./version";
import { baseScript } from './base-script';

export class oldScript extends baseScript{
    dateReleased = new Date(0);
    downloads = 0;
    lastDownload = new Date(0);
    export = false;
    comments:string[] = [];
    source:file = {name:"",key:"",location:""};
}