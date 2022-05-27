import { Test } from '@nestjs/testing';
import { ScriptEditorController } from './script-editor.controller';
// import { ScriptEditorService } from './script-editor.service';

describe('ScriptEditorController', () => {
  let controller: ScriptEditorController;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      // providers: [ScriptEditorService],
      controllers: [ScriptEditorController],
    }).compile();

    controller = module.get(ScriptEditorController);
  });

  it('should be defined', () => {
    expect(controller).toBeTruthy();
  });
});
