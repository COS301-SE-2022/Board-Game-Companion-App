import { file } from "./file";
import { status } from "./status";

export interface script{
    _id: string;
    name: string;
    author: string;
    boardgame: string;
    description: string;
    created: Date;
    release: Date;
    downloads: number;
    lastdownload: Date;
    lastupdate: Date;
    public: boolean;
    export: boolean;
    size: number;
    status: status;
    comments: string[];
    file: file;
    icon: string;
    __v: number;
}

export const empty:script = {
    _id: "",
    name: "",
    author: "",
    boardgame: "",
    description: "",
    created: new Date(0),
    release: new Date(0),
    downloads: 0,
    lastdownload: new Date(0),
    lastupdate: new Date(0),
    public: false,
    export: false,
    status: {value:0,message:"script has been flagged by the system"},
    size: 0,
    comments: [],
    file: {name:"",location:"",awsKey:""},
    icon: "",
    __v: 0,
}