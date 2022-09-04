import { Controller, Post, Body, Get, Query, HttpException, HttpStatus, Delete, Param  } from '@nestjs/common';
import { ReportService } from '../../services/reports/report.service';
import { Report } from '../../schemas/report.schema';

@Controller('reports')
export class ApiReportsController{
    constructor(private readonly reportsService:ReportService){}

    @Post('report')
    async report(@Body('userName')userName:string,@Body('userEmail')userEmail:string,@Body('script')script:string,@Body('message')message:string): Promise<Report>{
        return this.reportsService.report({name:userName,email:userEmail},script,message);       
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
    async alreadyIssued(@Query('userName')userName:string,@Query('userEmail')userEmail:string,@Query('script')script:string):Promise<boolean>{
        return this.reportsService.alreadyIssued({name:userName,email:userEmail},script);
    }

    @Get('count-reported')
    async countReportedScripts():Promise<number>{
        return this.reportsService.countReportedScripts();
    }   
}
