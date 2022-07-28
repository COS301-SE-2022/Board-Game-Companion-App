import { Controller, Post, Body,Get  } from '@nestjs/common';
import { ModelsService } from '../../services/models/models.service';

@Controller('models')
export class ApiModelsController {
    constructor(private readonly modelsService:ModelsService){}

    // @Post('create')
    // create(@Body('data')data:any[],@Body('inputFeatures')inputFeatures:string[],@Body('label')label:string):any{
    //     return this.modelsService.create(data,inputFeatures,label);
    // }

    // @Get('test')
    // test(){
    //     return this.modelsService.test();
    // }
}
