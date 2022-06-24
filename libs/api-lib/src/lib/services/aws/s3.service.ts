import { Injectable } from '@nestjs/common';
import * as aws from "aws-sdk";

@Injectable()
export class S3Service {
    AWS_S3_BUCKET = process.env.AWS_S3_BUCKET;
    s3 = new aws.S3({
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_KEY,
    });

    async uploadFile(file){
        const originalname  = file;

        await this.upload(file.buffer, this.AWS_S3_BUCKET, originalname, file.mimetype);
    }

    async upload(file, bucket, name, mimetype){
        const params = {
            Bucket: bucket,
            Key: String(name),
            Body: file,
            ACL: "public-read",
            ContentType: mimetype,
            ContentDisposition:"inline",
            CreateBucketConfiguration: 
            {
                LocationConstraint: "ap-south-1"
            }
        };

        console.log(params);

        try{
            const s3Response = await this.s3.upload(params).promise();

            console.log(s3Response);
        }catch (e){
            console.log(e);
        }
    }    
}
