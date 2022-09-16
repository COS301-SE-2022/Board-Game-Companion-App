import { file } from "../general/files";
import { user } from "../general/user";
import { version } from "../general/version";

export interface oldScriptDto{
    name: string;
    author: user;
    boardgame: string;
    description: string;
    version: version;
    size: number;
    icon: file;
    build: file;
    models: string[];
    previous: string[];
    dateReleased: Date;
    downloads: number;
    lastDownload: Date;
    export: boolean;
    comments: string[];
    rating: number;
    source: file;
    iconSize: number;
}