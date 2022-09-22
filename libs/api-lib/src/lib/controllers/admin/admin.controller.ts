import { Controller, Body,  Get, Query, Post, Put, Delete, Req ,UploadedFile, UseInterceptors, Param, HttpException, HttpStatus } from '@nestjs/common';
import { AlertService } from '../../services/alert/alert.service';
import { AlertDocument } from '../../schemas/alert.schema';
import { user } from '../../models/general/user';


@Controller('admin')
export class ApiAlertController {
    constructor(private readonly alertService:AlertService){}    
    
}
