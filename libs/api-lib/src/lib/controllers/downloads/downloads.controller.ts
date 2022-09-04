import { Controller, Body, Get, Post, Query, Delete, Param } from '@nestjs/common';
import { DownloadsService } from '../../services/downloads/downloads.service';
import { Script } from '../../schemas/script.schema';


@Controller('downloads')
export class DownloadsController {
    constructor(private readonly downloadsService:DownloadsService){}
    @Post('store-script')
    async storeScript(@Body('script')script:Script){
        return this.downloadsService.storeScript(script);
    }

    @Post('download')
    async download(@Body('name')name:string,@Body('owner')owner:user):Promise<any>{
        return this.downloadsService.download(name,owner);
    }

    @Get('retrieve/downloadedByMe')
    async getMyDownloads(@Query('ownerName')ownerName:string, @Query('ownerEmail')ownerEmail:string):Promise<Script[]>{
        return this.downloadsService.getMyDownloads({name:ownerName, email:ownerEmail});
    }

    @Get('retrieve/id')
    async retrieveById(@Query('id')id:string):Promise<Script>{
        return this.downloadsService.retrieveById(id);
    }

    @Delete('remove/id')
    async removeScript(@Param('id')id:string){
        this.downloadsService.removeScript(id);
    }
}
