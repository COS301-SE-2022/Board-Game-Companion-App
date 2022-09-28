import { Test, TestingModule } from '@nestjs/testing';
import { MongoDbStorageService } from '../mongodb-storage/mongodb-storage.service';
import { File, FileDocument } from '../../schemas/file.schema';
import { Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { user } from '../../models/general/user';
describe('MongoDbStorageService', () => {
   let service: MongoDbStorageService;
   let model: Model<FileDocument>;
    const user1: user ={
        name:"user1", 
        email: "user1@tuks.co.za",
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

    const intModule: TestingModule = await Test.createTestingModule({

    }).compile();

    service = module.get<MongoDbStorageService>(MongoDbStorageService);
    model =module.get<Model<FileDocument>>(getModelToken(File.name));
   });

   it('should be defined', () => {
        expect(service).toBeDefined();
        expect(model).toBeDefined();
    });

    it('should get a file', async ()=>{
        expect(await service.retrieve("key123")).toEqual({
            name: "key123",
            mimeType: ".json",
            data: "File data"
        })
    });

    // it('should a copy a file', async ()=>{
    //         expect(await service.copy("sourceKey")).toEqual({
    //             name: "sourceKey",
    //             mimeType: ".json",
    //             data: "File data"
    //         })
        
    // });

});
