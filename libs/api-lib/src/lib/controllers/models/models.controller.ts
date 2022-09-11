import { Controller, Post, Body, Get, Query, HttpException, HttpStatus, Delete, Param  } from '@nestjs/common';
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
    async alreadyStored(@Query('userName')userName:string,@Query('userEmail')userEmail:string,@Query('modelName')modelName:string):Promise<boolean>{
      return this.modelsService.alreadExists({name:userName,email:userEmail},modelName);
    }

    @Get('all')
    async getAll(@Query('userName')name:string,@Query('userEmail')email:string):Promise<NeuralNetwork[]>{
      return this.modelsService.getAll({name:name,email:email});
    }

    @Delete('remove')
    async remove(@Query('userName')userName:string,@Query('userEmail')userEmail:string,@Query('name')name:string){
       return this.modelsService.remove({name:userName,email:userEmail},name); 
    }

    @Get('retrieve-by-id')
    async getModel(@Query('id')id:string,@Query('userName')userName:string,@Query('userEmail')userEmail:string):Promise<NeuralNetwork>{
      return this.modelsService.getModel({name:userName,email:userEmail},id);
    }

    @Get('retrieve-subset')
    async getModels(@Query('userName')userName:string,@Query('userEmail')userEmail:string,@Query('idList')idList:string):Promise<NeuralNetwork[]>{
        
        
        try{
            const temp = JSON.parse(idList);
            return this.modelsService.getModels({name:userName,email:userEmail},temp)
        }catch(error){
            throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
        }
        
    }

    @Get('retrieve-subset-by-id-only')
    async getModelsByIdOnly(@Query('idList')idList:string):Promise<NeuralNetwork[]>{
        
        
        try{
            const temp = JSON.parse(idList);
            return this.modelsService.getModelsByIdOnly(temp)
        }catch(error){
            throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
        }
        
    }

}
