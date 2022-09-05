import { file } from "../general/file";
import { user } from "../general/user";
import { version } from "./version";
import { baseScript } from "./base-script";

export class downloadScript extends baseScript{
    _id = "";
    owner!:user;
    dateDownloaded!: Date;
}