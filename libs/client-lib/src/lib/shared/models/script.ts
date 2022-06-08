import { file } from "./file";
import { status } from "./status";

export interface script{
    _id: string;
    name: string;
    author: string;
    boardgame: string;
    created: Date;
    published: Date;
    downloads: number;
    lastdownload: Date;
    lastupdate: Date;
    public: boolean;
    export: boolean;
    size: number;
    status: status;
    comments: string[];
    files: file[];
    icon: string;
    __v: number;
}

export const empty:script = {
    _id: "",
    name: "",
    author: "",
    boardgame: "",
    created: new Date(0),
    published: new Date(0),
    downloads: 0,
    lastdownload: new Date(0),
    lastupdate: new Date(0),
    public: false,
    export: false,
    status: {value:0,message:"script has been flagged by the system"},
    size: 0,
    comments: [],
    files: [],
    icon: "",
    __v: 0,
}