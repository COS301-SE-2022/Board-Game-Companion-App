import { user } from '../general/user';

export interface report{
	_id: string   
    user: user;
    script: boolean;
    link: string;
    message: string;
    dateIssued: Date;
};