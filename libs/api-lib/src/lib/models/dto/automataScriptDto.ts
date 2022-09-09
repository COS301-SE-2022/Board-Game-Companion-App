import { file } from "../general/files";
import { user } from "../general/user";
import { version } from "../general/version";

export interface automataScriptDto{
    name: string;
    author: user;
    boardgame: string;
    description: string;
    version: version;
    size: number;
    icon: file;
    build: file;
    models: string[];
    dateReleased: Date;
    downloads: number;
    lastDownload: Date;
    export: boolean;
    comments: string[];
    source: file;
    previous: string[];
    link: string;
    iconSize: number;
}