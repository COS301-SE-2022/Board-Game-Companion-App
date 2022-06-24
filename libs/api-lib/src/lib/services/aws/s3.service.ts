import { Injectable } from '@nestjs/common';
import * as aws from "aws-sdk";

@Injectable()
export class S3Service {
    bucket = process.env.BUCKET;
    s3 = new aws.S3({
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_KEY,
    });

    async upload(file,path:string):Promise<string>{
        const key = (process.env.PROJECT_STATUS == "production" ? "production/" : "development/") + path + file.originalname;
        const params = {
            Bucket: this.bucket,
            Key: String(key),
            Body: file.buffer,
            ContentType: file.mimetype,
            ContentDisposition:"inline"
        };

        try{
            const result = await this.s3.upload(params).promise();

            return result.Location;
        }catch (e){
            console.log(e);
        }
    }    
}
