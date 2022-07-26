import { user } from "./user";

export interface comment{
    _id: string;
    user: user;
    image: string;
    created: Date;
    script: string;
    content: string;
    replies: string[];
}

export const empty:comment = {
    _id: "",
    user:{name:"",email:""},
    image:"",
    created: new Date(0),
    script: "",
    content: "",
    replies: []
}