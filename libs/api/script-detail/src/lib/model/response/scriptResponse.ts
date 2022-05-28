import { Script } from "../../schema/script.schema";

export interface createResponse{
    success:boolean;
    message:string;
    content: Script;
}

export interface retrieveResponse{
    success:boolean;
    message:string;
    content: {
        _id: string;
        name: string;
        author: string;
        boardgame: string;
        published: Date;
        downloads: number;
        lastDownload: Date;
        public: boolean;
        size: number;
        comments: Comment[];
        path: string;
        avatar: string;
        rating: number;
    }
}