import { Controller, Post, Body, Get, Query, HttpException, HttpStatus  } from '@nestjs/common';
import { ModelsService } from '../../services/models/models.service';
import { FormDataRequest, MemoryStoredFile } from 'nestjs-form-data';
import fs = require("fs");
import { user } from '../../models/general/user';
import { NeuralNetwork } from '../../schemas/neural-network.schema';

@Controller('models')
export class ApiModelsController {
    constructor(private readonly modelsService:ModelsService){}

    @Post('create')
    @FormDataRequest()
    async create(
            @Query('userName')userName: string,
            @Query('userEmail')userEmail: string,
            @Query('name')name: string,
            @Query('created')created: Date,
            @Query('accuracy')accuracy: number,
            @Query('loss')loss: number,
            @Query('type')type: string,
            @Query('labels')labels: string,
            @Query('min')min: string,
            @Query('max')max: string,
            @Body('model.json')model:MemoryStoredFile,
            @Body('model.weights.bin')weights:MemoryStoredFile):Promise<NeuralNetwork>{

      let minimum: number[] = [];
      let maximum: number[] = [];
      let categories: string[] = [];

      try{
        minimum = JSON.parse(min);
        maximum = JSON.parse(max);
        categories = JSON.parse(labels);
      }catch(error){
        throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST)
      }
      
      return this.modelsService.create(
                                        model,
                                        weights,
                                        {name:userName,email:userEmail},
                                        name,
                                        created,
                                        type,
                                        minimum,
                                        maximum,
                                        accuracy,
                                        loss,
                                        categories                                       
                                        )
    }

    @Get('stored')
    alreadyStored(@Query('userName')userName:string,@Query('userEmail')userEmail:string,@Query('modelName')modelName:string):boolean{
      const user:user = {name:userName,email:userEmail};

      return false;
    }

}
