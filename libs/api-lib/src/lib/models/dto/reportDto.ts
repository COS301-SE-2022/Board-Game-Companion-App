import { user } from '../general/user';

export interface reportDto{   
    user: user;
    script: string;
    message: string;
    dateIssued: Date;
};