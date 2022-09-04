import { HttpException, HttpStatus, Injectable, Query } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { MyScript, MyScriptDocument } from '../../schemas/my-script.schema';
import { NeuralNetwork, NeuralNetworkDocument } from '../../schemas/neural-network.schema';
import { myScriptDto } from '../../models/dto/myScriptDto';
import fs = require('fs');
import { status } from '../../models/general/status';
import { S3Service } from '../aws/s3.service'
import { file } from '../../models/general/files';
import { v4 as uuidv4 } from 'uuid';
import { upload } from '../../models/general/upload';
import { CompilerService } from '../compiler/compiler.service';
import fileSize = require("url-file-size");
import { user } from '../../models/general/user';
import { LocalStorageService } from '../local-storage/local-storage.service';
import { AutomataService } from '../automata/automata.service';
import { version } from '../../models/general/version';
import { OldScript, OldScriptDocument } from '../../schemas/old-script.schema';
import { automataScriptDto } from '../../models/dto/automataScriptDto';
import { AutomataScript, AutomataScriptDocument } from '../../schemas/automata-script.schema';
import { ModelsService } from '../models/models.service';
import { oldScriptDto } from '../../models/dto/oldScriptDto';
import { NeuralNetworkDiscriminator } from '../../models/general/modelDiscriminator'

@Injectable()
export class MyScriptService {
    months:string[] = ["January","February","March","April","May","June","July","August","September","October","November","December"];
    
    constructor(@InjectModel(MyScript.name) private myScriptModel: Model<MyScriptDocument>,
                @InjectModel(AutomataScript.name) private automataModel: Model<AutomataScriptDocument>,
                @InjectModel(OldScript.name) private oldScriptModel: Model<OldScriptDocument>,
                private readonly localStorage: LocalStorageService,
                private readonly automataService: AutomataService,
                private readonly modelService: ModelsService){
        
    }


    async create(user:user,name:string,boardGameId:string,stat:status,description:string,icon:any): Promise<MyScript> {
        const dto:myScriptDto = {
            name: name,
            author: user,
            version: {major:0,minor:0,patch:0},
            boardgame: boardGameId,
            description: description,
            created: new Date(),
            lastUpdate: new Date(),
            export: false,
            status: stat,
            size: 0,
            programStructure:{type:"root",name:"root",endLine:0,endPosition:0,startLine:0,startPosition:0,properties:[],children:[]},
            source: {name:"",location:"",key:""},
            build:{name:"",location:"",key:""},
            icon: {name:"",location:"",key:""},
            models: []
        };
        
        
        const createdScript = new this.myScriptModel(dto);
        const result:MyScriptDocument =  await createdScript.save();
        
        result.source = await this.createSourceFile(result._id);
        result.build = await this.createBuildFile(result._id);
        const savedIcon = await this.storeIcon(result._id,icon);
        result.icon = {name: icon.originalname,location:savedIcon.location,key:savedIcon.key};
        result.size = await fileSize(result.build.location).catch(console.error);
        result.size += await fileSize(result.icon.location).catch(console.error);
        
        result.save();

        return result;
    }


    async remove(id:string):Promise<void>{
        const script = await this.myScriptModel.findByIdAndRemove(id);
        fs.unlinkSync(script.source.key);
        fs.unlinkSync(script.build.key);
        fs.unlinkSync(script.icon.key);
        
        for(let count = 0; count < script.models.length; count++){
            const value = script.models[count];
            const model = await this.modelService.removeById(value);

            if(model !== null || model !== undefined){
                fs.unlinkSync(model.model.key);
                fs.unlinkSync(model.weights.key);
            }
        }
    }


    async createSourceFile(id:string):Promise<file>{
        const result:file = {name:"main.txt",location:"",key:""};
        let fileUploadResult:upload = {key:"",location:""};
        const path = "scripts/my-scripts/" + id + "/src/";
        let data = "";

        try{
            data = fs.readFileSync("templates/main.txt","utf8");
        }catch(err){
            console.log(err);
        }

        //fileUploadResult = await this.s3Service.upload("main.txt",path,data);
        fileUploadResult = await this.localStorage.upload("main.txt",path,data);
        result.location = fileUploadResult.location;
        result.key = fileUploadResult.key;

        return result;
    }

    async createBuildFile(id:string):Promise<file>{
        const result:file = {name:"main.js",location:"",key:""};
        let fileUploadResult:upload = {key:"",location:""};
        const path = "scripts/my-scripts/" + id + "/build/";
        let data = "";

        try{
            data = fs.readFileSync("templates/script.js","utf8");
        }catch(err){
            console.log(err);
        }

        //fileUploadResult = await this.s3Service.upload("main.js",path,data);
        fileUploadResult = await this.localStorage.upload("main.js",path,data);
        result.location = fileUploadResult.location;
        result.key = fileUploadResult.key;
        console.log(result);
        
        return result;        
    }

    async storeIcon(id:string,icon:any):Promise<upload>{
        const path = "scripts/my-scripts/" + id + "/icons/";
        
        //const result = await this.s3Service.upload(icon.originalname,path,icon.buffer);
        const result = await this.localStorage.upload(icon.originalname,path,icon.buffer);
        return result;
    }

    formatDate(date:Date):string{
        let result = "";
        
        const val = new Date(date);
    
        result = val.getDate() + " ";
        result += this.months[val.getMonth()] + " ";
        result += val.getFullYear() + ", ";
        result += val.getHours() + ":" + val.getMinutes() + ":" + val.getSeconds();
    
        return result;
    }

    async getAllMyScript(owner:user):Promise<MyScript[]>{
        return this.myScriptModel.find({"owner.name":owner.name,"owner.email":owner.email});
    }

    async checkName(name:string,user:user):Promise<boolean>{
        const id = await this.myScriptModel.exists({"name":name,"author.name":user.name,"author.email":user.email});

        return id !== null;
    }

    async update(id:string,exp:boolean,description:string):Promise<MyScript>{
        const result = await this.myScriptModel.findById(id);
        
        result.export = exp;
        result.description = description;
        
        result.save();
        return result;
    }

    async relegate(script: AutomataScriptDocument): Promise<void>{
        //this.oldScriptModel
        const dto:oldScriptDto = {
            name: script.name,
            author: script.author,
            boardgame: script.boardgame,
            downloads: script.downloads,
            size: script.size,
            comments: script.comments,
            description: script.description,
            version: {
                major: script.version.major,
                minor: script.version.minor,
                patch: script.version.patch
            },
            dateReleased: script.dateReleased,
            lastDownload: script.lastDownload,
            export: script.export,
            models: [],
            source: {name: "", key: "",location: ""},
            build: {name: "", key: "", location: ""},
            icon: {name: "", key: "", location: ""}
        };

        const createdScript = new this.oldScriptModel(dto);
        const result:OldScriptDocument =  await createdScript.save();
    
        const sourceCopy = this.localStorage.copy(script.source.key,"scripts/old-scripts/" + result._id + "/src/",script.source.name);
        
        result.source = {
            name: script.source.name,
            location: sourceCopy.location,
            key: sourceCopy.key
        }

        const buildCopy = this.localStorage.copy(script.build.key,"scripts/old-scripts/" + result._id + "/build/",script.build.name);
        
        result.build = {
            name: script.build.name,
            location: buildCopy.location,
            key: buildCopy.key
        }

        const iconCopy = this.localStorage.copy(script.icon.key,"scripts/old-scripts/" + result._id + "/icons/",script.icon.name);
        result.icon = {
            name: script.icon.name,
            location: iconCopy.location,
            key: iconCopy.key
        }

        for(let count = 0; count < script.models.length; count++){
            const value = script.models[count];
            const modelCopy = await this.modelService.copyModel(value,NeuralNetworkDiscriminator.OldScript);
            
            if(modelCopy !== "")
                result.models.push(modelCopy);
        }

        this.automataService.remove(script._id);

        await result.save();
    }

    async release(id:string,version:version):Promise<{success:boolean,message?:string,content?:AutomataScript}>{
        const script = await this.myScriptModel.findById(id);

        if(script === null || script === undefined)
            return {success: false,message: "Can not find script you are trying to release."};
        
        const current:AutomataScriptDocument = await this.automataService.getAutomataScript(script.name,script.author);

        if(current !== null && current !== undefined){
            this.relegate(current);
        }

        const dto:automataScriptDto = {
            name: script.name,
            author: script.author,
            boardgame: script.boardgame,
            comments: [],
            dateReleased: new Date(),
            description: script.description,
            downloads: 0,
            export: script.export,
            lastDownload: null,
            size: script.size,
            version: version,
            source: {name: "",location:"",key:""},
            build: {name: "",location:"",key:""},
            icon: {name: "",location:"",key:""}, 
            models: []
        }

        const createdScript = new this.automataModel(dto);
        const result:AutomataScriptDocument =  await createdScript.save();


        const sourceCopy = this.localStorage.copy(script.source.key,"scripts/automata-scripts/" + result._id + "/src/",script.source.name);
        
        result.source = {
            name: script.source.name,
            location: sourceCopy.location,
            key: sourceCopy.key
        }

        const buildCopy = this.localStorage.copy(script.build.key,"scripts/automata-scripts/" + result._id + "/build/",script.build.name);
        
        result.build = {
            name: script.build.name,
            location: buildCopy.location,
            key: buildCopy.key
        }

        const iconCopy = this.localStorage.copy(script.icon.key,"scripts/automata-scripts/" + result._id + "/icons/",script.icon.name);
        result.icon = {
            name: script.icon.name,
            location: iconCopy.location,
            key: iconCopy.key
        }

        for(let count = 0; count < script.models.length; count++){
            const value = script.models[count];
            const modelCopy = await this.modelService.copyModel(value,NeuralNetworkDiscriminator.AutomataScript);
            
            if(modelCopy !== "")
                result.models.push(modelCopy);
        }

        script.status.value = 2;

        script.version.major = version.major;
        script.version.minor = version.minor;
        script.version.patch = version.patch;

        await script.save();
        await result.save();

        return {success: true,content:result};
    }
}
