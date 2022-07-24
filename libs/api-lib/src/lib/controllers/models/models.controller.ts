import { Controller, Body,  Get, Query, Post, Put, Delete, Req ,UploadedFile, UseInterceptors, Param, HttpException, HttpStatus } from '@nestjs/common';
import { ModelsService } from '../../services/models/models.service';

@Controller('comments')
export class ApiModelsController {
    constructor(private readonly modelsService:ModelsService){}

}
