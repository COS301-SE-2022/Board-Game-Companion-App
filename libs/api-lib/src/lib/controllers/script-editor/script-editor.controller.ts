import { Controller, Post, /*UploadedFile, UseInterceptors, StreamableFile,*/ Query, Body, Get, } from '@nestjs/common';
import { ScriptEditorService } from '../../services/editor/script-editor.service';
// import { FileInterceptor } from '@nestjs/platform-express';
// import { Script } from '../../schemas/script.schema';
// import { diskStorage } from 'multer';
// import { v4 as uuidv4 } from 'uuid';
// import path = require('path');
// import { contentBlur } from '@syncfusion/ej2-angular-richtexteditor';
// import { createReadStream } from 'fs';
// import { join } from 'path';
// const storage = {
//   storage: diskStorage({
//       destination:"./uploads/scripts",
//         filename: (req, file, cb) => {
//           const filename: string = path.parse(file.originalname).name.replace(/\s/g, '') + uuidv4();
//           const extension: string = path.parse(file.originalname).ext;

//           cb(null, `${filename}${extension}`)
//       }
//     })
//   }
@Controller('script-editor')
export class ScriptEditorController {
  constructor(private readonly scriptEditorService: ScriptEditorService) {}

  @Post('upload')
  // @UseInterceptors(FileInterceptor('script',storage))

  async UploadScript(@Body('id') id: string, @Body('filename') filename: string, @Body('content') content: string){

    return {message: await this.scriptEditorService.saveFile(id,filename,content)};
  }

  @Get('content')
  async getFile(@Query('id') id: string, @Query('filename') filename: string) : Promise<any>{
    console.log(filename, id);
    return {content: await this.scriptEditorService.FileContent(id, filename)};
  } 
}

