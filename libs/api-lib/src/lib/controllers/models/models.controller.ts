import { Controller, Post, Body  } from '@nestjs/common';
import { ModelsService } from '../../services/models/models.service';

@Controller('models')
export class ApiModelsController {
    constructor(private readonly modelsService:ModelsService){}

    @Post('create')
    create(@Body('data')data:any[],@Body('inputFeatures')inputFeatures:string[],@Body('outputLabels')outputLabels:string[]):any{
        return this.modelsService.create(data,inputFeatures,outputLabels);
    }
}
