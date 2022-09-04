import { Injectable } from '@nestjs/common';
import { upload } from '../../models/general/upload';
import fs = require("fs");

@Injectable()
export class LocalStorageService{

    async upload(name:string,path:string,data:any):Promise<upload>{
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

    update(key:string,data:string){
        fs.writeFileSync(key,data);
    }

    copy(source:string,destination:string,name:string):upload{
        destination = (process.env.PROJECT_STATUS == "production" ? "uploads/production/" : "uploads/development/") + destination;
        const key = destination + name;
        
        try{
            fs.mkdirSync(destination,{recursive: true});
            fs.copyFileSync(source,key);  
            return {location:"http://localhost:3333/"+key,key:key};
        }catch (e){
            console.log(e);
        }
    }
}
