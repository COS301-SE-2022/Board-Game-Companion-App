import { Controller, Body,  Get, Query, Post, Put, Delete, Req ,UploadedFile, UseInterceptors, Param, HttpException, HttpStatus } from '@nestjs/common';
import { MyScriptService } from '../../services/my-script/my-script.service';
import { MyScript } from '../../schemas/my-script.schema';
import { Request } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import path = require('path');
import { status } from '../../models/general/status';
import { CompilerService } from '../../services/compiler/compiler.service';
import * as chevrotain from 'chevrotain';
import { lexerResult } from '../../models/general/lexerResult';
import { user } from '../../models/general/user';
import { AutomataScript } from '../../schemas/automata-script.schema';

@Controller('my-scripts')
export class ApiMyScriptController {
    constructor(private readonly myScriptService:MyScriptService){}
    
    @Post('create-script')
    @UseInterceptors(FileInterceptor('icon'))
    async createScript(@Body('userName')userName:string,@Body('userEmail')userEmail:string,@Body('name')name:string,@Body('boardGameId')boardGameId:string,@Body('description')description:string,@UploadedFile()icon): Promise<MyScript>{ 
        const stat:status = {value : 1, message:  name + " has been in progress since " +this.myScriptService.formatDate(new Date()) + "."}

        return this.myScriptService.create({name:userName,email:userEmail},name,boardGameId,stat,description,icon);
    }

    @Get('all-my-script')
    async getAllMyScript(@Query('userName')userName:string,@Query('userEmail')userEmail:string):Promise<MyScript[]>{
        return this.myScriptService.getAllMyScript({name:userName,email:userEmail});
    }

    @Get('check-name')
    async checkName(@Query('userName')userName:string,@Query('userEmail')userEmail:string,@Query('name')name:string):Promise<boolean>{
        return this.myScriptService.checkName(name,{name:userName,email:userEmail});
    }

    @Put('update')
    async update(@Body('id')id:string,@Body('export')exp:boolean,@Body('description')description:string){
        return this.myScriptService.update(id,exp,description);
    }

    @Get('release')
    async release(@Query('id')id: string,@Query('vMajor')vMajor: number,@Query('vMinor')vMinor: number,@Query('vPatch')vPatch: number):Promise<{success:boolean,message?:string,content?:AutomataScript}>{
        return this.myScriptService.release(id,{major:vMajor,minor:vMinor,patch:vPatch});
    }
}
