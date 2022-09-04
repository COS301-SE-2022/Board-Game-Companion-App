import { file } from "../general/files";
import { user } from "../general/user";
import { version } from "../general/version";
import { baseScript } from "./base-script";

export interface downloadScript extends baseScript{
    owner: user;
    dateDownloaded: Date;
}