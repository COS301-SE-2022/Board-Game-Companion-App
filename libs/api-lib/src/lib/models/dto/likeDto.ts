import { user } from '../general/user';

export interface likeDto{
    comment: string;   
    user: user;
    like: boolean;
};