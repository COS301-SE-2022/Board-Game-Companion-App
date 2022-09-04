import { entity } from "../general/entity";
import { file } from "../general/files";
import { status } from "../general/status";
import { user } from '../general/user';
import { version } from '../general/version';

export interface myScriptDto{
    name: string;
    author: user;
    boardgame: string;
    description: string;
    version: version;
    size: number;
    icon: file;
    build: file;
    models: string[];
    created : Date;
    lastUpdate: Date;
    status:status;
    export: boolean;
    programStructure:entity;
    source: file; 
}