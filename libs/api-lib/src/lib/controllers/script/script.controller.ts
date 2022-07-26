import { Controller, Body,  Get, Query, Post, Put, Delete, Req ,UploadedFile, UseInterceptors, Param, HttpException, HttpStatus } from '@nestjs/common';
import { ScriptService } from '../../services/scripts/script.service';
import { Script } from '../../schemas/script.schema';
import { Request } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import path = require('path');
import { status } from '../../models/general/status';
import { RatingService } from '../../services/ratings/rating.service';
import { Rating } from '../../schemas/rating.schema';
import { CompilerService } from '../../services/compiler/compiler.service';
import * as chevrotain from 'chevrotain';
import { lexerResult } from '../../models/general/lexerResult';

@Controller('scripts')
export class ApiScriptController {
    constructor(private readonly scriptService:ScriptService,
        private readonly ratingService:RatingService,
        private readonly compiler:CompilerService){}
    
    @Post('create-script')
    @UseInterceptors(FileInterceptor('icon'))
    async createScript(@Body('user')user:string,@Body('name')name:string,@Body('boardGameId')boardGameId:string,@Body('description')description:string,@UploadedFile()icon): Promise<Script>{ 
        const stat:status = {value : 1, message:  name + " has been in progress since " +this.scriptService.formatDate(new Date()) + "."}

        return this.scriptService.create(user,name,boardGameId,stat,description,icon);
    }

    @Get('retrieve/byid')
    async retrieveScript(@Query('id')id:number): Promise<Script>{
        return await this.scriptService.findById(id);
    }
    
    @Get('retrieve/all')
    async retrieveAllScripts():Promise<Script[]>{
        return await this.scriptService.findAll();
    }

    @Get('retrieve/byowner')
    async getAllMyScripts(@Query('owner')owner:string):Promise<Script[]>{
        return await this.scriptService.getAllMyScripts(owner);
    }

    @Post('update')
    async updateScriptInfo(@Body('id')id:string,@Body('name')name:string,@Body('public')pub:boolean,@Body('export')exp:boolean,@Body('status')stat:status){
        return await this.scriptService.updateInfo(id,name,pub,exp,stat); 
    }

    @Put('update/status')
    async updateStatus(@Body('id')id:string,@Body('value')value:number,@Body('message')message:string):Promise<Script>{
        return await this.scriptService.updateStatus(id,value,message);
    }

    @Delete('remove/:id')
    async removeScript(@Param('id')id:string){
       await this.scriptService.removeById(id); 
    }

    //rating functions
    
    @Post('rate')
    async createUserRating(@Body('user')user:string,@Body('script')script:string,@Body('value')value:number):Promise<Rating>{
        return this.ratingService.rate(user,script,value);
    }

    @Get('retrieve-rating')
    async retrieveUserRating(@Query('user')user:string,@Query('script')script:string): Promise<Rating>{
        return this.ratingService.getRating(user,script);
    }

    @Get('count-rating')
    async countRating(@Query('script')script:string): Promise<number>{
        return this.ratingService.countRating(script);
    }

    @Get('average-rating')
    async averateRating(@Query('script')script:string): Promise<number>{
        return this.ratingService.average(script);
    }

    //comment functions
    @Put('add-comment')
    async addComment(@Body('scriptId')scriptId:string,@Body('commentId')commentId:string):Promise<void>{
        this.scriptService.addComment(scriptId,commentId);
    }    

    @Put("update-file")
    async updateFile(@Body('id')id:string,@Body('content')content:string):Promise<any>{
        return this.scriptService.updateFile(id,content);
    }

    @Post('compile')
    compile(@Body('input')input:string):lexerResult{
        return this.compiler.scan(input);
    }
}
