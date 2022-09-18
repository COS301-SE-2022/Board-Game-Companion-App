import { file } from "../general/file";
import { baseScript } from './base-script';

export class oldScript extends baseScript{
    dateReleased = new Date(0);
    previous:string[] = [];
    downloads = 0;
    lastDownload = new Date(0);
    export = false;
    comments:string[] = [];
    rating = 0;
    source:file = {name:"",key:"",location:""};
}