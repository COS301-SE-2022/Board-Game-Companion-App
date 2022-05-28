export interface commentDto{
    user: string;
    time: number;
    published: Date;
    likes: number;
    dislikes: number;
    content: string;
    replies: Comment[];     
};