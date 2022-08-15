import { Controller, Post, Body, Get, Query  } from '@nestjs/common';
import { ModelsService } from '../../services/models/models.service';
import { FormDataRequest, MemoryStoredFile } from 'nestjs-form-data';
import fs = require("fs");
import { user } from '../../models/general/user';

@Controller('models')
export class ApiModelsController {
    constructor(private readonly modelsService:ModelsService){}

    @Post('upload')
    @FormDataRequest()
    uploadFile(@Body('model.json')model:MemoryStoredFile,@Body('model.weights.bin')weights:MemoryStoredFile){
      fs.writeFileSync('templates/' + model.originalName,model.buffer);
      fs.writeFileSync('templates/' + weights.originalName,weights.buffer);
      return {success:true}
    }

    @Get('stored')
    alreadyStored(@Query('userName')userName:string,@Query('userEmail')userEmail:string,@Query('modelName')modelName:string):boolean{
      const user:user = {name:userName,email:userEmail};

      return false;
    }

}
