import { Controller, Body,  Get, Query, Post } from '@nestjs/common';
import { ScriptService } from '../service/scripts/script.service';
import { scriptDto } from '../model/scriptDto';
import { createResponse }  from '../model/response/scriptResponse';

@Controller('scripts')
export class ApiScriptDetailController {
    constructor(private readonly scriptService:ScriptService){}
    
    @Post('create')
    async create(@Body() dto:scriptDto): Promise<createResponse>{ 
        return {success:true,message:"script saved.",content:await this.scriptService.create(dto)}; 
    }
}
