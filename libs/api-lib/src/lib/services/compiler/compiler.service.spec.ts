import { Test, TestingModule } from '@nestjs/testing';
import { CompilerService } from './compiler.service';

/*************************************************unit test**********************************************/

describe('ScriptService', () => {
  let service: CompilerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CompilerService],
    }).compile();

    service = module.get<CompilerService>(CompilerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
