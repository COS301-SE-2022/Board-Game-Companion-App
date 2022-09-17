import { user } from "../general/user";

export interface alertDto{
    recepient: user;
    date: Date;
    message: string;
    link: string;
    alertType: number;
    read: boolean;
}