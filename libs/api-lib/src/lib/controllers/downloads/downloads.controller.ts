import { Controller, Body, Get, Post, Query, Delete, Param } from '@nestjs/common';
import { DownloadsService } from '../../services/downloads/downloads.service';
import { Script } from '../../schemas/script.schema';


@Controller('downloads')
export class DownloadsController {
    constructor(private readonly downloadsService:DownloadsService){}

    @Get('already-downloaded')
    async alreadDownloaded(@Query('ownerName')ownerName:string,@Query('ownerEmail')ownerEmail:string,@Query('authorName')authorName:string,@Query('authorEmail')authorEmail:string,@Query('name')name:string,@Query('vMajor')vMajor:number,@Query('vMinor')vMinor:number,@Query('vPatch')vPatch:number):Promise<boolean>{
        return this.downloadsService.alreadDownloaded({name:ownerName,email:ownerEmail},{name:authorName,email:authorEmail},name,{major:vMajor,minor:vMinor,patch:vPatch});
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
