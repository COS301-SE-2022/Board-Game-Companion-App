import { user } from "../general/user";

export interface collection{
    owner: user;
    name: string;
    description: string;
    boardgames: string[]
}