import { user } from "../general/user";
import { baseScript } from "./base-script";

export class downloadScript extends baseScript{
    _id = "";
    link = "";
    owner!:user;
    dateDownloaded!: Date;
}