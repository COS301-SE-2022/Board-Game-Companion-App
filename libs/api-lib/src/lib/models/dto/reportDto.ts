import { user } from '../general/user';

export interface reportDto{   
    user: user;
    script: boolean;
    link: string;
    message: string;
    dateIssued: Date;
};