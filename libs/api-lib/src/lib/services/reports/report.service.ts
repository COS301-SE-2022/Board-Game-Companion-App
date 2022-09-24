import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Report, ReportDocument } from '../../schemas/report.schema';
import { reportDto } from '../../models/dto/reportDto';
import mongoose from 'mongoose';
import { user } from '../../models/general/user';
import { MyScript, MyScriptDocument } from '../../schemas/my-script.schema';
import { AutomataScript, AutomataScriptDocument } from '../../schemas/automata-script.schema';
import { DownloadScript, DownloadScriptDocument } from '../../schemas/download-script.schema';
import { AlertService } from '../alert/alert.service';
import { alertType } from '../../models/general/alertType';
import { OldScript, OldScriptDocument } from '../../schemas/old-script.schema';
import { Comment, CommentDocument } from '../../schemas/comment.schema';

@Injectable()
export class ReportService {
    constructor(@InjectModel(Report.name) private reportModel: Model<ReportDocument>,
                @InjectModel(MyScript.name) private myScriptModel: Model<MyScriptDocument>,
                @InjectModel(AutomataScript.name) private automataModel: Model<AutomataScriptDocument>,
                @InjectModel(DownloadScript.name) private downloadsModel:Model<DownloadScriptDocument>,
                @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
                @InjectModel(OldScript.name) private oldModel: Model<OldScriptDocument>,
                private readonly alertService: AlertService){}

    async report(user:user, script:boolean, link:string, message:string): Promise<Report>{
        const dto:reportDto = {
            user: user,
            script: script,
            link: link,
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

    async alreadyIssued(user:user,link:string):Promise<boolean>{
        const temp = await this.reportModel.exists({"user.name":user.name,"user.email":user.email,"link":link});
        
        return temp !== null;
    }

    async countReportedScripts():Promise<number>{
        const result = await this.reportModel.distinct('field')
        return result.length;
    }

    async flag(id:string):Promise<void>{
        const temp = await this.reportModel.findByIdAndRemove(id);
        
        if(temp === null || temp === undefined)
            return;

        if(temp.script){
            const automata = await this.automataModel.findByIdAndRemove(temp.link);
            
            if(automata === null || automata === undefined)
                return;

            const myscript = await this.myScriptModel.findById(automata.link);

            if(myscript === null || myscript === undefined)
                return;

            myscript.status.value = 0;
            myscript.save();

            const downloads = await this.downloadsModel.find({"link":automata._id});
            downloads.forEach((download:DownloadScriptDocument) => {
                this.alertService.create(download.owner,"download-script@" + download._id,alertType.Flagged)
            })

            this.alertService.create(myscript.author,"my-script@" + myscript._id,alertType.Flagged);

        }else{
            const comment = await this.commentModel.findByIdAndRemove(temp.link);

            if(comment === null || comment === undefined)
                return;

            const automata = await this.automataModel.find({});
            const old = await this.oldModel.find({});

            for(let count = 0; count < automata.length; count++){
                if(automata[count].comments.includes(temp.link)){
                    automata[count].comments = automata[count].comments.filter((id:string) => id !== temp.link);
                    automata[count].save();
                }
            }

            for(let count = 0; count < old.length; count++){
                if(old[count].comments.includes(temp.link)){
                    old[count].comments = old[count].comments.filter((id:string) => id !== temp.link);
                    old[count].save();
                }
            }

            this.alertService.create(comment.user,"comment@" + comment.script,alertType.Flagged);
        }
    }
}
