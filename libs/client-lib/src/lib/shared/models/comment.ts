export interface comment{
    _id: string;
    name: string;
    image: string;
    created: Date;
    script: string;
    likes: number;
    dislikes: number;
    content: string;
    replies: string[];
}

export const empty:comment = {
    _id: "",
    name:"",
    image:"",
    created: new Date(0),
    script: "",
    likes: 0,
    dislikes: 0,
    content: "",
    replies: []
}