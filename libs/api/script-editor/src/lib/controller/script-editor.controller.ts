import { Controller, Post, UploadedFile, UseInterceptors, Body, Get, StreamableFile, Query } from '@nestjs/common';
import { ScriptEditorService } from '../service/script-editor.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Metadata } from '../models/Metadata';

@Controller('script-editor')
export class ScriptEditorController {
  constructor(private readonly scriptEditorService: ScriptEditorService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('script'))
  async UploadScript(@Body('author') author: string, @Body('downloads') downloads: number, @Body('ratings') ratings: number,@UploadedFile() script){
    const metadata: Metadata = {
      author: author,
      downloads: downloads,
      ratings: ratings,
    };
    return {message: await this.scriptEditorService.saveFile(metadata, script)};
  }

  @Get('update')
  async getFile(@Query('author') author: string) : Promise<StreamableFile>
  {
    return await this.scriptEditorService.FileUpdate(author);
  }
}
