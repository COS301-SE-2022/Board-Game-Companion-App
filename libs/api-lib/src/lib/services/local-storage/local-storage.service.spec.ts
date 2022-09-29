import { Test, TestingModule } from '@nestjs/testing';
import { LocalStorageService } from '../local-storage/local-storage.service';
import { upload } from '../../models/general/upload';

describe('ScriptService', () => {
  let service: LocalStorageService;

  const myUpload: upload ={
    location:"http://localhost:3333/uploads/development/././desktop/storagescript12",
    key:"uploads/development/././desktop/storagescript12",
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LocalStorageService],
    }).compile();

    service = module.get<LocalStorageService>(LocalStorageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('upload', ()=>{
    it('sould upload a storage file', async()=>{
      expect(service.upload("script12", "././desktop/storage", "data")).resolves.toEqual(myUpload)
    });
  });
  // describe('update', ()=>{
  //   it('should update the file', ()=>{
  //     expect(service.update("someKey", "data")).toBeDefined();
  //   })
  // });

  // describe('copy', ()=>{
  //   it('should copy storage file', ()=>{
  //     expect( service.copy("source", "../desktop", "thisName")).resolves.toEqual(myUpload);
  //   })
  // })

});
