import { user } from '../general/user';

export interface commentDto{
    user: user;
    image: string;
    created: Date;
    script: string;
    content: string;
    replies: string[];     
};