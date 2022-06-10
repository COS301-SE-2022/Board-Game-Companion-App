import { Test } from '@nestjs/testing';
import { ScriptEditorService } from './script-editor.service';

describe('ApiScriptEditorService', () => {
  let service: ScriptEditorService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [ScriptEditorService],
    }).compile();

    service = module.get(ScriptEditorService);
  });

  it('should be defined', () => {
    expect(service).toBeTruthy();
  });
});
