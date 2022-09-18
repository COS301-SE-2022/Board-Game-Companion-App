import { Controller, Body, Get, Post, Query, Delete, Param, Put } from '@nestjs/common';
import { DownloadsService } from '../../services/downloads/downloads.service';
import { Script } from '../../schemas/script.schema';
import { DownloadScript } from '../../schemas/download-script.schema';
import { update } from '../../models/general/update';
import { AutomataScript } from '../../schemas/automata-script.schema';
import { OldScript } from '../../schemas/old-script.schema';


@Controller('download-scripts')
export class ApiDownloadScriptController {
    constructor(private readonly downloadsService:DownloadsService){}

    @Get('already-downloaded')
    async alreadDownloaded(@Query('ownerName')ownerName:string,@Query('ownerEmail')ownerEmail:string,@Query('authorName')authorName:string,@Query('authorEmail')authorEmail:string,@Query('name')name:string,@Query('vMajor')vMajor:number,@Query('vMinor')vMinor:number,@Query('vPatch')vPatch:number):Promise<boolean>{
        return this.downloadsService.alreadyDownloaded({name:ownerName,email:ownerEmail},{name:authorName,email:authorEmail},name,{major:vMajor,minor:vMinor,patch:vPatch});
    }
 
    @Get('retrieve-all')
    async getMyDownloads(@Query('ownerName')ownerName:string, @Query('ownerEmail')ownerEmail:string):Promise<DownloadScript[]>{
        return this.downloadsService.getMyDownloads({name:ownerName, email:ownerEmail});
    }

    @Get('retrieve-id')
    async retrieveById(@Query('id')id:string):Promise<DownloadScript>{
        return this.downloadsService.retrieveById(id);
    }

    @Delete('remove/id')
    async removeScript(@Param('id')id:string){
        this.downloadsService.removeScript(id);
    }

    @Put('update')
    async update(@Body('ids')ids:update):Promise<DownloadScript>{
        return this.downloadsService.update(ids);
    }

    @Delete('remove')
    async remove(@Query('id')id:string):Promise<void>{
        return this.downloadsService.removeScript(id);
    }

    @Get('info')
    async getDownloadInfo(@Query('id')id:string):Promise<AutomataScript | OldScript>{
        return this.downloadsService.getDownloadInfo(id);
    }
}
