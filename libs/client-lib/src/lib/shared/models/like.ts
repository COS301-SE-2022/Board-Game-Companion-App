import { user} from './user'

export interface like{
    _id: string
    comment: string;
    user: user;
    like: boolean;
}