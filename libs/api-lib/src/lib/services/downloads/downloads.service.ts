import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Script, ScriptDocument } from '../../schemas/script.schema';
import { user } from '../../models/general/user';
import { scriptDto } from '../../models/dto/scriptDto';
import { HttpService } from '@nestjs/axios';
import { LocalStorageService } from '../local-storage/local-storage.service';

@Injectable()
export class DownloadsService {
    constructor(@InjectModel('Downloaded') private downloadsModel:Model<ScriptDocument>,
                @InjectModel(Script.name) private scriptModel: Model<ScriptDocument>,
                private readonly httpService: HttpService,
                private readonly localStorage: LocalStorageService){}

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

    async download(name:string,owner:user):Promise<{status:string,message:string,script:Script}>{
        const result = {
            status:"success",
            message:"Successfully downloaded " + name + " on " + (new Date()).toString(),
            script:null
        }

        let script:ScriptDocument = await this.scriptModel.findOne({"name": name,"owner.email":owner.email});
        
        if(script !== null){
            result.status = "warning";
            result.message = "You already downloaded " + script.name + ".";
        }else{
            script = await this.scriptModel.find({"name": name});  
            
            if(script === null){
                result.status = "danger";
                result.message = "The script you are trying to download does not exist.";
            }else{
                if(script.status.value !== 2){
                    result.status = "danger";
                    
                    if(script.status.value === 0)
                        result.message = "The script you are trying to download has been flagged.";
                    
                    if(script.status.value === 1)
                        result.message = "The script you are trying to download is still in development.";
                }else{
                    const dto:scriptDto = {
                        name: script.name,
                        author: script.author,
                        owner: owner,
                        boardgame: script.boardgame,
                        description: script.description,
                        created: new Date(script.created),
                        release: script.release,
                        lastupdate: script.lastupdate,
                        downloads: script.downloads,
                        lastdownload: script.lastdownload,
                        public: script.public,
                        export: script.export,
                        status: script.status,
                        size: script.size,
                        comments: script.comments,
                        programStructure: null,
                        source: {name:"",location:"",key:""},
                        build:{name:"",location:"",key:""},
                        icon: {name:"",location:"",key:""},
                        models: []
                    };

                    const createdScript = new this.downloadsModel(dto);
                    const newScript:ScriptDocument = await createdScript.save();
                    const data  = (await this.httpService.axiosRef.get(script.build.location,{
                        responseType:'text'
                    })).data;

                    //const buildResponse = await this.s3Service.upload(script.build.name,"scripts/" + newScript._id + "/build/",data);
                    const buildResponse = await this.localStorage.upload(script.build.name,"downloads/" + newScript._id + "/build/",data);
                    //console.log(buildResponse)
                    newScript.build = {
                        name = script.build.name,
                        key = buildResponse.key,
                        location = buildResponse.location
                    }

                    
                    const image = (await this.httpService.axiosRef.get(script.icon.location));
                   
                    //const savedIcon = await this.s3Service.upload(script.icon.name,"scripts/" + newScript._id + "/icons/",image);
                    const savedIcon = await this.localStorage.upload(script.icon.name,"downloads/" + newScript._id + "/icons/",image)
                    newScript.icon = {
                        name: script.icon.name,
                        location: savedIcon.location,
                        key: savedIcon.key
                    }

                    script.lastdownload = new Date();

                    script.save();
                    newScript.save();
                    result.script = newScript;
                    
                }
            }
        }

        return result;
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
