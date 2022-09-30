import { Controller, Post, Body, Get, Query, HttpException, HttpStatus, Delete, Param  } from '@nestjs/common';
import { ReportService } from '../../services/reports/report.service';
import { Report } from '../../schemas/report.schema';

@Controller('reports')
export class ApiReportsController{
    constructor(private readonly reportsService:ReportService){}

    @Post('report')
    async report(@Body('userName')userName:string,@Body('userEmail')userEmail:string,@Body('script')script:boolean,@Body('link')link:string,@Body('message')message:string): Promise<Report>{
        return this.reportsService.report({name:userName,email:userEmail},script,link,message);       
    }


    @Get('retrieve-all')
    async getAll():Promise<Report[]>{
        return this.reportsService.getAll();
    }

    @Delete('remove')
    async remove(@Query('id')id:string):Promise<Report>{
        return this.reportsService.remove(id);
    }

    @Get('retrieve-by-id')
    async getByScript(@Query('id')id:string):Promise<Report[]>{
        return this.reportsService.getByScript(id);
    }

    @Get('already-issued')
    async alreadyIssued(@Query('userName')userName:string,@Query('userEmail')userEmail:string,@Query('link')link:string):Promise<boolean>{
        return this.reportsService.alreadyIssued({name:userName,email:userEmail},link);
    }

    @Get('count-reported')
    async countReportedScripts():Promise<number>{
        return this.reportsService.countReportedScripts();
    }   

    @Get('flag')
    async flag(@Query('id')id:string):Promise<void>{
        this.reportsService.flag(id);
    }
}
