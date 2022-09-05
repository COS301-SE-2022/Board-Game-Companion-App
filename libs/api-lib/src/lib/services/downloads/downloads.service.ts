import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DownloadScript, DownloadScriptDocument } from '../../schemas/download-script.schema';
import { user } from '../../models/general/user';
import { scriptDto } from '../../models/dto/scriptDto';
import { HttpService } from '@nestjs/axios';
import { LocalStorageService } from '../local-storage/local-storage.service';

@Injectable()
export class DownloadsService {
    constructor(@InjectModel(DownloadScript.name) private downloadsModel:Model<DownloadScriptDocument>,
                private readonly httpService: HttpService,
                private readonly localStorage: LocalStorageService){}


    async alreadyDownloaded(owner:user,author:user,name:string,version:version):Promise<boolean>{
        const script =  this.downloadsModel.findOne({   "owner.name": owner.name,
                                            "owner.email": owner.email,
                                            "author.name": author.name,
                                            "author.email": author.email,
                                            "name":name,
                                            "version.major":version.major,
                                            "version.minor":version.minor,
                                            "version.patch":version.patch
                                        });

        return script !== null && script !== undefined;
    }

    async getMyDownloads(owner:user):Promise<Script[]>{
        return this.downloadsModel.find({"owner.email":owner.email});
    }
    async retrieveById(id:string):Promise<Script>{
        return this.downloadsModel.findById(id).exec();
    }
    async removeScript(id:string){
        this.downloadsModel.findByIdAndRemove(id).exec();
    }
}
