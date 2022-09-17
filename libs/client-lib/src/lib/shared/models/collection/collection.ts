import { user } from "../general/user";

export interface collection{
    _id: string;
    owner: user;
    name: string;
    boardgames: string[]
}