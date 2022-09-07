import { user } from "../general/user";

export interface collectionDto{
    owner: user;
    name: string;
    description: string;
    boardgames: string[]
}