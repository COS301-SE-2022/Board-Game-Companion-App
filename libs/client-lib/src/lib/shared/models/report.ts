import { user } from './user';

export interface report{
	_id: string   
    user: user;
    script: string;
    message: string;
    dateIssued: Date;
};