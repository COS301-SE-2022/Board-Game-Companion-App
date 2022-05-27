import { Module } from '@nestjs/common';
import { ApiScriptDetailController } from './controller/api-script-detail.controller';

@Module({
  controllers: [ApiScriptDetailController],
  providers: [],
  exports: [],
})
export class ApiScriptDetailModule {}
