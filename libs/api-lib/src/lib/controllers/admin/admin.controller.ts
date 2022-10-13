import { Controller, Body,  Get, Query, Post, Put, Delete, Req ,UploadedFile, UseInterceptors, Param, HttpException, HttpStatus } from '@nestjs/common';
import { AdminService } from '../../services/admin/admin.service';
import { AlertDocument } from '../../schemas/alert.schema';
import { userSearch } from '../../models/general/userSearch';
import { Moderator } from '../../schemas/moderator.schema';
import { Ban } from '../../schemas/ban.schema';
import { user } from '../../models/general/user';

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

    @Get('count-total-accounts')
    async getTotalAccounts():Promise<number>{
        return this.adminService.getTotalAccounts();
    }

    @Delete('remove')
    async remove(@Query('id')id:string):Promise<Moderator>{
        return this.adminService.remove(id);
    }

    @Post('ban')
    async ban(@Body('name')name:string,@Body('email')email:string):Promise<Ban>{
        return this.adminService.ban({name:name,email:email})
    }

    @Get('banned')
    async banned(@Query('name')name:string,@Query('email')email:string):Promise<boolean>{
        return this.adminService.banned({name:name,email:email});
    }

    @Get('isAdmin')
    async isAdmin(@Query('email')email:string):Promise<boolean>{
        return this.adminService.isAdmin(email);
    }

    @Post('unban')
    async unban(@Body('email')email:string):Promise<Ban>{
        return this.adminService.unban(email);
    }

    @Post('warn')
    async warn(@Body('name')name:string,@Body('email')email:string,@Body('message')message:string):Promise<void>{
        this.adminService.warn({name:name,email:email},message);
    }

    @Get('search')
    async search(@Query('term')term:string):Promise<userSearch[]>{
        
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

    @Get('count-active-accounts')
    async getActiveAccounts():Promise<number>{
        return this.adminService.getActiveAccounts();
    }

    @Get('count-loggedIn-users')
    async getLoggedInUsers():Promise<number>{
        return this.adminService.getLoggedInUsers();
    }

    @Get('count-script-authors')
    async countScriptAuthors():Promise<number>{
        return this.adminService.countScriptAuthors();
    }

}
