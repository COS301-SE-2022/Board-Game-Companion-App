import { Module } from '@nestjs/common';
import { ScriptEditorController } from './controller/script-editor.controller';
import { ScriptEditorService } from './service/script-editor.service';

@Module({
  controllers: [ScriptEditorController],
  providers: [ScriptEditorService],
  exports: [],
})
export class ApiScriptEditorModule {}
