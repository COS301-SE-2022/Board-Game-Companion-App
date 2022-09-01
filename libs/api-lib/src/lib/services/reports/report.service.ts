import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Report, ReportDocument } from '../../schemas/report.schema';
import { reportDto } from '../../models/dto/reportDto';
import mongoose from 'mongoose';
import { user } from '../../models/general/user';

@Injectable()
export class ReportService {
    constructor(@InjectModel(Report.name) private reportModel: Model<ReportDocument>){}

    async report(user:user,script:string,message:string): Promise<Report>{
        const dto:reportDto = {
            user: user,
            script: script,
            message: message,
            dateIssued: new Date()
        };

        const createdReport = new this.reportModel(dto);
        const result:Report = await createdReport.save();

        return result;
    }

    async getAll():Promise<Report[]>{
        return this.reportModel.find().exec();
    }

    async remove(id:string):Promise<Report>{
        const result = await this.reportModel.findById(id);
        this.reportModel.findByIdAndDelete(id);
        return result;
    }

    async getByScript(id:string):Promise<Report[]>{
        return this.reportModel.find({"script":id});
    }

    async alreadyIssued(user:user):Promise<boolean>{
        const count = await this.reportModel.countDocuments({"user.name":user.name,"user.email":user.email});
        
        return count > 0;
    }

    async countReportedScripts():Promise<number>{
        const result = await this.reportModel.distinct('field')
        return result.length;
    }
}
