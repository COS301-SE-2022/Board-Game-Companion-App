import { file } from "../general/files";
import { status } from "../general/status";
import { commentDto  } from "./commentDto";

export interface scriptDto{
    name: string;
    author: string;
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
    comments: commentDto[];
    source: file;
    build: file;
    icon: string;
};