import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Script, ScriptDocument } from '../../schemas/script.schema';
import { user } from '../../models/general/user';
import { scriptDto } from '../../models/dto/scriptDto';
@Injectable()
export class DownloadsService {
    constructor(@InjectModel('Downloaded')private downloadsModel:Model<ScriptDocument>){}
    async storeScript(script:Script){
        
        const dto:scriptDto = {
            name: script.name,
            author: script.author,
            owner: script.owner,
            boardgame: script.boardgame,
            description: script.description,
            created: new Date(script.created),
            release: script.release,
            lastupdate: script.lastupdate,
            downloads: script.downloads,
            lastdownload: script.lastdownload,
            public: script.public,
            export: script.public,
            status: script.status,
            size: script.size,
            comments: script.comments,
            programStructure:{type:"root",name:"root",endLine:0,endPosition:0,startLine:0,startPosition:0,properties:[],children:[]},
            source: script.source,
            build: script.build,
            icon: script.icon,
            models: script.models
        };
        const result = new this.downloadsModel(dto).save();
        console.log(result);
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
