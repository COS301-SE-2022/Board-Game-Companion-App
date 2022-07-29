import { Controller, Post, Body,Get, UseInterceptors, UploadedFiles  } from '@nestjs/common';
import { ModelsService } from '../../services/models/models.service';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('models')
export class ApiModelsController {
    constructor(private readonly modelsService:ModelsService){}

    @Post('save-files')
    @UseInterceptors(FilesInterceptor('files'))
    uploadFile(@UploadedFiles() files:any){
      console.log(files);
    }

}
