import { file } from "../general/files";
import { user } from "../general/user";
import { version } from "../general/version";

export interface downloadScriptDto{
    name: string;
    author: user;
    boardgame: string;
    description: string;
    version: version;
    size: number;
    icon: file;
    build: file;
    models: string[];
    owner: user;
    dateDownloaded: Date;
    link: string;
}