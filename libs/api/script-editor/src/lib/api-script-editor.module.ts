import { Module } from '@nestjs/common';
import { ScriptEditorController } from './controller/script-editor.controller';
import { ScriptEditorService } from './service/script-editor.service';
import {MetadataSchema } from './models/Metadata';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Metadata', schema: MetadataSchema }])],
  controllers: [ScriptEditorController],
  providers: [ScriptEditorService],
  exports: [],
})
export class ApiScriptEditorModule {}
