import { Injectable } from '@nestjs/common';
import { awsUpload } from '../../models/general/awsUpload';
import fs = require("fs");

@Injectable()
export class LocalStorageService{

    async upload(name:string,path:string,data:any):Promise<awsUpload>{
        path = (process.env.PROJECT_STATUS == "production" ? "uploads/production/" : "uploads/development/") + path;
        const key = path + name;
        
        try{
            fs.mkdirSync(path,{recursive: true});
            fs.writeFileSync(key,data);    
            return {location:"http://localhost:3333/"+key,key:key};
        }catch (e){
            console.log(e);
        }
    }

    async update(key:string,data:string){
        fs.writeFileSync(key,data);
    }
}
