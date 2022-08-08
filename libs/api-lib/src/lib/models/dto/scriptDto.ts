import { entity } from "../general/entity";
import { file } from "../general/files";
import { status } from "../general/status";
import { user } from '../general/user';

export interface scriptDto{
    name: string;
    author: user;
    owner: user;
    boardgame: string;
    description: string;
    created: Date;
    lastupdate: Date;
    release: Date;
    downloads: number;
    lastdownload: Date;
    status: status;
    public: boolean;
    export: boolean;
    size: number;
    comments: string[];
    programStructure:entity;
    source: file;
    build: file;
    icon: file;
};