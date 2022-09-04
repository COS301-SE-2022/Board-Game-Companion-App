import { user} from '../general/user'

export interface rating{
    _id: string;
    user: user;
    script: string;
    value: number;
}