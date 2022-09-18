import { baseScript } from './base-script';
import { file } from '../general/file';

export class automataScript extends baseScript {
    _id = "";
    dateReleased =  new Date(0);
    downloads = 0;
    lastDownload = new Date(0);
    export = false;
    comments: string[] = [];
    rating = 0;
    source: file = { name: "", key: "", location: ""};
    previous: string[] = [];
}