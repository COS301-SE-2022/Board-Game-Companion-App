import { Test, TestingModule } from '@nestjs/testing';
import * as aws from "aws-sdk";
//import { UploadComponent } from 'libs/client-lib/src/lib/models/upload/upload.component';
import { S3Service } from './s3.service';

import { getType } from 'jest-get-type';

import { upload } from '../../models/general/upload';
import { data, string } from '@tensorflow/tfjs';

describe('ScriptService', () => {
  let service: S3Service;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [S3Service],
    }).compile();

    service = module.get<S3Service>(S3Service);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // upload and update 

  it('should upload a file', async ()=>{
    
    const thisParam ={
      Bucket: process.env.BUCKET,
      Key: String(process.env.PROJECT_STATUS == "production" ? "production/" : "development/"),
      Body: "some Data",//file.buffer,
      ContentDisposition:"inline",
    };
   
    const result: upload ={
      location: expect.any(String),
      key: expect.any(String),
    };
  
    expect(thisParam).toBeDefined();
    expect(result).toBeDefined();
    
    jest.spyOn(service,'upload').mockReturnValue(expect.objectContaining(result));
    
  });

  it('should update a file', async ()=>{
    
    const result= jest.spyOn(service,'update');
    
    expect(result).toBeDefined();
    
  }); 
});
