import { Test } from '@nestjs/testing';
import { ApiScriptDetailController } from './api-script-detail.controller';

describe('ApiScriptDetailController', () => {
  let controller: ApiScriptDetailController;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [],
      controllers: [ApiScriptDetailController],
    }).compile();

    controller = module.get(ApiScriptDetailController);
  });

  it('should be defined', () => {
    expect(controller).toBeTruthy();
  });
});
