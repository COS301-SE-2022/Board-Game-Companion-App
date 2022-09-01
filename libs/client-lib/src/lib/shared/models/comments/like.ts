import { user} from '../general/user'

export interface like{
    _id: string
    comment: string;
    user: user;
    like: boolean;
}