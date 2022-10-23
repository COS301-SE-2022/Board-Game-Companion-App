import { fileType } from "../general/fileType";

export interface fileDto{
    name: string;
    type: fileType;
    data: string[];
}