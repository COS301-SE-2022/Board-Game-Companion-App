import { Test, TestingModule } from '@nestjs/testing';
import { ApiFileManagerController } from '../file-manager/file-manager.controller';
import { MongoDbStorageService } from '../../services/mongodb-storage/mongodb-storage.service';
import { any } from '@tensorflow/tfjs';

jest.mock('../../services/mongodb-storage/mongodb-storage.service');
/***************************************************Unit Test***********************************************/

describe('ApiFileManagerController',()=>{
  let controller: ApiFileManagerController;
  let service: MongoDbStorageService; 

  beforeEach(async ()=>{
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [ApiFileManagerController],
      providers: [{
        provide: MongoDbStorageService,
        useValue:{
          retrieve: jest.fn().mockImplementation((name:string,type:string,data:any)=>
          Promise.resolve({
            name:name,
            mimeType:type,
            data:any
          })
          )
        }
      }]
    }).compile()

    controller= moduleRef.get<ApiFileManagerController>(ApiFileManagerController);
    service= moduleRef.get<MongoDbStorageService>(MongoDbStorageService);
  })

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  // describe('getFile', ()=>{
  //     it('should get a file', ()=>{
  //       return controller.getFile("thisKey").then(data=>{
  //       expect(data.toString()).toBe(({
  //         name:"thisKey",
  //         mimeType:"type",
  //         data:"anythingIguess"
  //       }).toString());
  //     });
  //     });
  // });
});