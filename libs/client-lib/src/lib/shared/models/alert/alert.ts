import { user } from "../general/user";

export interface alert{
    _id: string;
    recepient: user;
    date: Date;
    link: string;
    alertType: number;
    read: boolean;
}