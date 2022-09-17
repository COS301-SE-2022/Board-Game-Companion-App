import { user } from "../general/user";

export interface alertDto{
    recepient: user;
    date: Date;
    link: string;
    alertType: number;
    read: boolean;
}