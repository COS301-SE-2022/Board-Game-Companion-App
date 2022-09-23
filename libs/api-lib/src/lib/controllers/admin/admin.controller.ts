import { Controller, Body,  Get, Query, Post, Put, Delete, Req ,UploadedFile, UseInterceptors, Param, HttpException, HttpStatus } from '@nestjs/common';
import { AdminService } from '../../services/admin/admin.service';
import { AlertDocument } from '../../schemas/alert.schema';
import { user } from '../../models/general/user';
import { Moderator } from '../../schemas/moderator.schema';


@Controller('admin')
export class ApiAdminController {
    constructor(private readonly adminService:AdminService){}    
    
    
    @Post('create')
    async create(@Body('email')email:string):Promise<Moderator>{
        return this.adminService.create(email);
    }

    @Put('set-admin')
    async setAdmin(@Body('id')id:string,@Body('admin')admin:boolean):Promise<Moderator>{
        return this.adminService.setAdmin(id,admin);
    }

    @Get('retreive-all')
    async getAll():Promise<Moderator[]>{
        return this.adminService.getAll();
    }

    @Delete('remove')
    async remove(@Query('id')id:string):Promise<Moderator>{
        return this.adminService.remove(id);
    }

    @Get('search')
    async search(@Query('term')term:string):Promise<user[]>{
        return this.adminService.search(term);
    }

    @Get('count-downloaders')
    async countDownloaders():Promise<number>{
        return this.adminService.countDownloaders();
    }

    @Get('count-collection-owners')
    async countCollectionOwners():Promise<number>{
        return this.adminService.countCollectionOwners();
    }

    @Get('count-script-authors')
    async countScriptAuthors():Promise<number>{
        return this.adminService.countScriptAuthors();
    }

}
