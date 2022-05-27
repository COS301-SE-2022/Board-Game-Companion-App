import { Test, TestingModule } from '@nestjs/testing';
import { ScriptDatailService } from './script-datail.service';

describe('ScriptDatailService', () => {
  let service: ScriptDatailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ScriptDatailService],
    }).compile();

    service = module.get<ScriptDatailService>(ScriptDatailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
