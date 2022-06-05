import { file } from "./file";

export interface script{
    _id: string;
    name: string;
    author: string;
    boardgame: string;
    created: Date;
    published: Date;
    downloads: number;
    lastdownload: Date;
    public: boolean;
    export: boolean;
    size: number;
    comments: string[];
    files: file[];
    icon: string;
    __v: number;
}