import { baseScript } from './base-script';
import { file } from '../general/file';
import { status as stat} from '../general/status';
import { entity,empty } from '../editor/entity';

export class myScript extends baseScript{
    _id = "";
    created: Date = new Date(0);
    lastUpdate: Date = new Date(0);
    status:stat = {value:0,message:""};
    export = false;
    programStructure:entity = empty;
    source: file = { name: "", location: "", key: ""};
}
