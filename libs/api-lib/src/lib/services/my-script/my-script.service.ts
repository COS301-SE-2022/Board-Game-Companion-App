import { HttpException, HttpStatus, Injectable, Query } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { MyScript, MyScriptDocument } from '../../schemas/my-script.schema';
import { NeuralNetwork, NeuralNetworkDocument } from '../../schemas/neural-network.schema';
import { myScriptDto } from '../../models/dto/myScriptDto';
import fs = require('fs');
import { status } from '../../models/general/status';
import { file } from '../../models/general/files';
import { v4 as uuidv4 } from 'uuid';
import { upload } from '../../models/general/upload';
import { CompilerService } from '../compiler/compiler.service';
import fileSize = require("url-file-size");
import { user } from '../../models/general/user';
import { AutomataService } from '../automata/automata.service';
import { version } from '../../models/general/version';
import { OldScript, OldScriptDocument } from '../../schemas/old-script.schema';
import { DownloadScript, DownloadScriptDocument } from '../../schemas/download-script.schema';
import { automataScriptDto } from '../../models/dto/automataScriptDto';
import { AutomataScript, AutomataScriptDocument } from '../../schemas/automata-script.schema';
import { ModelsService } from '../models/models.service';
import { oldScriptDto } from '../../models/dto/oldScriptDto';
import { NeuralNetworkDiscriminator } from '../../models/general/modelDiscriminator'
import { HttpService } from '@nestjs/axios';
import { MongoDbStorageService } from '../mongodb-storage/mongodb-storage.service';
import { CollectionsService } from '../collection/collections.service';
import { AlertService } from '../alert/alert.service';
import { alertType } from '../../models/general/alertType';
import { Collection } from '../../schemas/collection.schema';
import { fileType } from '../../models/general/fileType';

@Injectable()
export class MyScriptService {
    months:string[] = ["January","February","March","April","May","June","July","August","September","October","November","December"];
    
    constructor(@InjectModel(MyScript.name) private myScriptModel: Model<MyScriptDocument>,
                @InjectModel(AutomataScript.name) private automataModel: Model<AutomataScriptDocument>,
                @InjectModel(OldScript.name) private oldScriptModel: Model<OldScriptDocument>,
                @InjectModel(DownloadScript.name) private downloadsModel:Model<DownloadScriptDocument>,
                private readonly automataService: AutomataService,
                private readonly modelService: ModelsService,
                private readonly httpService: HttpService,
                private readonly storageService: MongoDbStorageService,
                private readonly collectionService: CollectionsService,
                private readonly alertService: AlertService){
        
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
            models: [],
            iconSize: icon.size
        };
        
        
        const createdScript = new this.myScriptModel(dto);
        const result:MyScriptDocument =  await createdScript.save();
        
        result.source = await this.createSourceFile(result._id);
        result.build = await this.createBuildFile(result._id);
        const savedIcon = await this.storeIcon(result._id,icon);
        result.icon = {name: icon.originalname,location:savedIcon.location,key:savedIcon.key};
        
        result.size = icon.size + fs.readFileSync("templates/main.txt","utf8").length;        
        result.save();

        return result;
    }

    async getMyScriptInfo(id:string):Promise<AutomataScript>{
        return this.automataModel.findOne({"link":id});
    }


    async remove(id:string):Promise<void>{
        const script = await this.myScriptModel.findByIdAndRemove(id);
        if(script === null || script === undefined)
            return;

        this.storageService.remove(script.source.key);
        this.storageService.remove(script.build.key);
        this.storageService.remove(script.icon.key);

        const automata = await this.automataModel.findOne({"link":script._id});
        if(automata === null || automata === undefined)
            return;

        this.relegate(automata);
    }


    async createSourceFile(id:string):Promise<file>{
        const result:file = {name:"main.txt",location:"",key:""};
        let fileUploadResult:upload = {key:"",location:""};
        //const path = "scripts/my-scripts/" + id + "/src/";
        let data = "";

        try{
            data = fs.readFileSync("templates/main.txt","utf8");
        }catch(err){
            console.log(err);
        }

        //fileUploadResult = await this.s3Service.upload("main.txt",path,data);
        //fileUploadResult = await this.localStorage.upload("main.txt",path,data);
        fileUploadResult = await this.storageService.upload("main.txt",fileType.text,[data]);
        result.location = fileUploadResult.location;
        result.key = fileUploadResult.key;

        return result;
    }

    async createBuildFile(id:string):Promise<file>{
        const result:file = {name:"main.js",location:"",key:""};
        let fileUploadResult:upload = {key:"",location:""};
        //const path = "scripts/my-scripts/" + id + "/build/";
        let data = "";

        try{
            data = fs.readFileSync("templates/script.js","utf8");
        }catch(err){
            console.log(err);
        }

        //fileUploadResult = await this.s3Service.upload("main.js",path,data);
        //fileUploadResult = await this.localStorage.upload("main.js",path,data);
        fileUploadResult = await this.storageService.upload("main.js",fileType.text,[data]);

        result.location = fileUploadResult.location;
        result.key = fileUploadResult.key;
        
        return result;        
    }

    async storeIcon(id:string,icon:any):Promise<upload>{
        //const path = "scripts/my-scripts/" + id + "/icons/";
        
        //const result = await this.s3Service.upload(icon.originalname,path,icon.buffer);
        //const result = await this.localStorage.upload(icon.originalname,path,icon.buffer);

        
        const result = await this.storageService.upload(icon.originalname,fileType.image,[Buffer.from(icon.buffer).toString('base64')]);

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

    async getAll():Promise<MyScript[]>{
        return this.myScriptModel.find({});
    }

    async getAllMyScript(author:user):Promise<MyScript[]>{
        return this.myScriptModel.find({"author.name":author.name,"author.email":author.email});
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

    async getMyScriptById(id:string):Promise<MyScriptDocument>{
        return this.myScriptModel.findById(id);
    }

    async alertCollection(script: AutomataScriptDocument): Promise<void>{
        const collections = await this.collectionService.getAllCollections();
        
        collections.forEach((value:Collection) => {
            if(value.boardgames.includes(script.boardgame)){
                this.alertService.create(value.owner,`${script._id}@${script.boardgame}`,alertType.Collection);
            }
        })
    }

    async alertDownloads(script: AutomataScriptDocument): Promise<void>{
        const downloads = await this.downloadsModel.find({});
        
        downloads.forEach((value:DownloadScriptDocument) => {
            if(script.previous.includes(value.link)){
                this.alertService.create(value.owner,`${script._id}@${value._id}`,alertType.Update);
            }
        })
    }   

    async relegate(script: AutomataScriptDocument): Promise<OldScriptDocument>{
        //this.oldScriptModel
        const dto:oldScriptDto = {
            name: script.name,
            author: script.author,
            boardgame: script.boardgame,
            downloads: script.downloads,
            size: script.size,
            comments: script.comments,
            rating: script.rating,
            description: script.description,
            previous: script.previous,
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
            icon: {name: "", key: "", location: ""},
            iconSize: script.iconSize,
        };

        const createdScript = new this.oldScriptModel(dto);
        const result:OldScriptDocument =  await createdScript.save();
    
        const sourceCopy = await this.storageService.copy(script.source.key);
        
        result.source = {
            name: script.source.name,
            location: sourceCopy.location,
            key: sourceCopy.key
        }

        const buildCopy = await this.storageService.copy(script.build.key);
        
        result.build = {
            name: script.build.name,
            location: buildCopy.location,
            key: buildCopy.key
        }

        const iconCopy = await this.storageService.copy(script.icon.key);
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

        const downloads = await this.downloadsModel.find({"link":script._id});
        console.log(downloads.length);

        downloads.forEach((value) => {
            value.link = result._id;
            value.save();
        });

        this.automataService.remove(script._id);
        
        await result.save();

        return result;
    }

    async release(id:string,version:version):Promise<{success:boolean,message?:string,content?:AutomataScript}>{
        const script = await this.myScriptModel.findById(id);
        const previous = [];

        if(script === null || script === undefined)
            return {success: false,message: "Can not find script you are trying to release."};
        
        const current:AutomataScriptDocument = await this.automataService.getAutomataScript(script.name,script.author);

        if(current !== null && current !== undefined){
            current.previous.forEach((value)=> previous.push(value));
            const old = await this.relegate(current);
            previous.push(old._id);
        }

        const dto:automataScriptDto = {
            name: script.name,
            author: script.author,
            boardgame: script.boardgame,
            comments: [],
            rating: 0,
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
            models: [],
            previous: previous,
            link: script._id,
            iconSize: script.iconSize
        }

        const createdScript = new this.automataModel(dto);
        const result:AutomataScriptDocument =  await createdScript.save();


        const sourceCopy = await this.storageService.copy(script.source.key);
        
        result.source = {
            name: script.source.name,
            location: sourceCopy.location,
            key: sourceCopy.key
        }

        const buildCopy = await this.storageService.copy(script.build.key);
        
        result.build = {
            name: script.build.name,
            location: buildCopy.location,
            key: buildCopy.key
        }

        const iconCopy = await this.storageService.copy(script.icon.key);
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

        this.alertCollection(result);
        this.alertDownloads(result);

        await script.save();
        await result.save();

        return {success: true,content:result};
    }

    async importAutomata(id:string,author:user):Promise<void>{
        const script = await this.automataModel.findById(id);
        
        if(script === null || script === undefined)
            return;

        const dto:myScriptDto = {
            name: script.name,
            author: author,
            version: {major:0,minor:0,patch:0},
            boardgame: script.boardgame,
            description: '',
            created: new Date(),
            lastUpdate: new Date(),
            export: false,
            status: {value: 1, message: ''},
            size: script.size,
            programStructure:{type:"root",name:"root",endLine:0,endPosition:0,startLine:0,startPosition:0,properties:[],children:[]},
            source: {name:"",location:"",key:""},
            build:{name:"",location:"",key:""},
            icon: {name:"",location:"",key:""},
            models: [],
            iconSize:script.iconSize
        }

        const createdScript = new this.myScriptModel(dto);
        const result:MyScriptDocument =  await createdScript.save();

        const sourceCopy = await this.storageService.copy(script.source.key);
        
        result.source = {
            name: script.source.name,
            location: sourceCopy.location,
            key: sourceCopy.key
        }

        const buildCopy = await this.storageService.copy(script.build.key);
        
        result.build = {
            name: script.build.name,
            location: buildCopy.location,
            key: buildCopy.key
        }

        const iconCopy = await this.storageService.copy(script.icon.key);
        result.icon = {
            name: script.icon.name,
            location: iconCopy.location,
            key: iconCopy.key
        }
        
        result.save();
    
    }

    async retrieveAllScripts():Promise<MyScript[]>{
        return this.myScriptModel.find({});
    }
}
