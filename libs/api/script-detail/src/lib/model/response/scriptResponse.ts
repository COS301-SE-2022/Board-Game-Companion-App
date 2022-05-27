import { Script } from "../../schema/script.schema";

export class createResponse{
    success:boolean;
    message:string;
    content: Script;
}