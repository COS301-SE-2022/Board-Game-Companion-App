import { Injectable } from '@nestjs/common';
import * as aws from "aws-sdk";
import { awsUpload } from '../../models/general/awsUpload';

@Injectable()
export class S3Service {
    bucket = process.env.BUCKET;
    s3 = new aws.S3({
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_KEY,
    });

    async upload(name:string,path:string,data:any):Promise<awsUpload>{
        const key = (process.env.PROJECT_STATUS == "production" ? "production/" : "development/") + path + name;
        const params = {
            Bucket: this.bucket,
            Key: String(key),
            Body: data,//file.buffer,
            ContentDisposition:"inline"
        };

        try{
            const result = await this.s3.upload(params).promise();
            
            return {location:result.Location,key:result.Key};
        }catch (e){
            console.log(e);
        }
    }

    async update(key:string,data:string){
        const params = {
            Bucket: this.bucket,
            Key: String(key),
            Body: data,//file.buffer,
            ContentDisposition:"inline"
        };

        await this.s3.upload(params).promise();
    }    
}
