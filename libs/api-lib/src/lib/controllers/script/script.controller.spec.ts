import { Test } from '@nestjs/testing';
import { ApiScriptController } from './script.controller';

describe('ApiScriptDetailController', () => {
  let controller: ApiScriptController;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [],
      controllers: [ApiScriptController],
    }).compile();

    controller = module.get(ApiScriptController);
  });

  it('should be defined', () => {
    expect(controller).toBeTruthy();
  });
});
