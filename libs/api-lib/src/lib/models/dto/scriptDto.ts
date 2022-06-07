import { commentDto  } from "./commentDto";

export interface scriptDto{
    name:string;
    author:string;
    boardgame:string;
    published:Date;
    downloads:number;
    lastdownload:Date;
    public:boolean;
    size:number;
    comment: commentDto[];
    path:string;
    avatar:string;
};