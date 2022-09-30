import { Test, TestingModule } from '@nestjs/testing';
import { MongoDbStorageService } from '../mongodb-storage/mongodb-storage.service';
import { File, FileDocument } from '../../schemas/file.schema';
import { Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { user } from '../../models/general/user';
import { upload } from '../../models/general/upload';
describe('MongoDbStorageService', () => {
   let service: MongoDbStorageService;
   let model: Model<FileDocument>;
    const user1: user ={
        name:"user1", 
        email: "user1@tuks.co.za",
    };

    const mockFileDoc= (mock?:Partial<File>): Partial<FileDocument>=>({
        name: mock?.name || "myFile",
        mimeType: mock?.mimeType || ".json",
        data: mock?.data|| "someData"
    });

    const myUpload : upload ={
        location: "iconLocation",
        key: "iconKey" 
    };

   beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MongoDbStorageService,
      {
        provide: getModelToken(File.name),
        useValue: {
            save: jest.fn(async ()=>{
                return{
                    id:"script",
                }
            }),
            findById: jest.fn((id)=>{
                return{
                    name: id,
                    mimeType: ".json",
                    data: "File data"
                }
            }),
            copy: jest.fn((id)=>{
                return{
                    name: id,
                    mimeType: ".json",
                    data: "File data"
                }
            }),
            post: jest.fn(),
            patch: jest.fn(),
            put: jest.fn(),
            delete: jest.fn(),
        },
      },
    ],
    }).compile();

    service = module.get<MongoDbStorageService>(MongoDbStorageService);
    model =module.get<Model<FileDocument>>(getModelToken(File.name));
   });

   it('should be defined', () => {
        expect(service).toBeDefined();
        expect(model).toBeDefined();
    });

    // describe('retrieve', ()=>{
    //     it('should retrive the storage service', ()=>{
    //         expect(service.retrieve("key")).resolves.toEqual(mockFileDoc)
    //     })
    // });
    // describe('upload', ()=>{
    //     it('should upload the storage', ()=>{
    //         expect(service.upload("script12", "script", "data")).resolves.toEqual(myUpload)
    //     })
    // });

    // describe('update', ()=>{
    //     it('should update the storage', ()=>{
    //         expect(service.update("scrp1123", "data")).resolves.toEqual(true);
    //     });
    // });

    // describe('remove', ()=>{
    //     it('should remove the storage', ()=>{
    //         expect(service.remove("scrp1123")).resolves.toEqual(true);
    //     });
    // });

    // describe('copy', ()=>{
    //     it('should copy the storage', ()=>{
    //         expect(service.copy("scrp1123")).resolves.toEqual(myUpload);
    //     });
    // });

    
  
});
