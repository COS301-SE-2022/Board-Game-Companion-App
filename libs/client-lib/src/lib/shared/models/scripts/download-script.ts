import { file } from "../general/file";
import { user } from "../general/user";
import { version } from "./version";
import { baseScript } from "./base-script";

export interface downloadScript extends baseScript{
    owner: user;
    dateDownloaded: Date;
}