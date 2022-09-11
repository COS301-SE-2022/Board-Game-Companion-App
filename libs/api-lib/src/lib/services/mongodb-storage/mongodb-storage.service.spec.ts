import { Test, TestingModule } from '@nestjs/testing';
import { MongoDbStorageService } from './mongodb-storage.service';

describe('ScriptService', () => {
  let service: MongoDbStorageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MongoDbStorageService],
    }).compile();

    service = module.get<MongoDbStorageService>(MongoDbStorageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
