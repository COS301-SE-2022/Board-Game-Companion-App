export interface comment{
    _id: string;
    name: string;
    image: string;
    created: Date;
    script: string;
    content: string;
    replies: string[];
}

export const empty:comment = {
    _id: "",
    name:"",
    image:"",
    created: new Date(0),
    script: "",
    content: "",
    replies: []
}