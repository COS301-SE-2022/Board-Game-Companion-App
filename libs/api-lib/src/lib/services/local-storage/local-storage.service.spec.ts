import { Test, TestingModule } from '@nestjs/testing';
import { LocalStorage } from './local-storage.service';

describe('ScriptService', () => {
  let service: LocalStorage;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LocalStorage],
    }).compile();

    service = module.get<LocalStorage>(LocalStorage);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
