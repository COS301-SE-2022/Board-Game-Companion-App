import { Controller, Body, Get, Post, Query, Delete, Param } from '@nestjs/common';
import { DownloadsService } from '../../services/downloads/downloads.service';
import { Script } from '../../schemas/script.schema';


@Controller('downloads')
export class DownloadsController {
    constructor(private readonly downloadsService:DownloadsService){}
    @Post('store-script')
    async storeScript(@Body('script')script:Script){
        return await this.downloadsService.storeScript(script);
    }

    @Get('retrieve/downloadedByMe')
    async getMyDownloads(@Query('ownerName')ownerName:string, @Query('ownerEmail')ownerEmail:string):Promis<Script[]>{
        return await this.downloadsService.getMyDownloads({name:ownerName, email:ownerEmail});
    }

    @Get('retrieve/id')
    async retrieveById(@Query('id')id:string):Promise<Script>{
        return await this.downloadsService.retrieveById(id);
    }

    @Delete('remove/id')
    async removeScript(@Param('id')id:string){
        await this.downloadsService.removeScript(id);
    }
}
