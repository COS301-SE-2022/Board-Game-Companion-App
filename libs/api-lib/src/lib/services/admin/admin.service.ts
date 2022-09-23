import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { user } from '../../models/general/user';
import { AutomataScript, AutomataScriptDocument } from '../../schemas/automata-script.schema';
import { OldScript, OldScriptDocument } from '../../schemas/old-script.schema';
import { Collection, CollectionDocument } from '../../schemas/collection.schema';
import { DownloadScript, DownloadScriptDocument } from '../../schemas/download-script.schema';
import { NeuralNetwork, NeuralNetworkDocument } from '../../schemas/neural-network.schema';
import { MyScript, MyScriptDocument } from '../../schemas/my-script.schema';
import { Moderator, ModeratorDocument } from '../../schemas/moderator.schema';
import { moderatorDto } from '../../models/dto/moderatorDto';
import { SocketGateway } from '../socket/socket.gateway';
import { userSearch } from '../../models/general/userSearch';

@Injectable()
export class AdminService {

    constructor(@InjectModel(AutomataScript.name) private readonly automataModel: Model<AutomataScriptDocument>,
                @InjectModel(MyScript.name) private readonly myscriptModel: Model<MyScriptDocument>,
                @InjectModel(DownloadScript.name) private readonly downloadModel: Model<DownloadScriptDocument>,
                @InjectModel(OldScript.name) private readonly oldModel: Model<OldScriptDocument>,
                @InjectModel(Collection.name) private readonly collectionModel: Model<CollectionDocument>,
                @InjectModel(Moderator.name) private readonly moderatorModel: Model<ModeratorDocument>,
                @InjectModel(NeuralNetwork.name)private readonly networkModel: Model<NeuralNetworkDocument>,
                private readonly socket:SocketGateway){}


    async create(email:string):Promise<Moderator>{
        const check = await this.moderatorModel.find({"email":email});
        
        if(check === null || check === undefined)
            return null;

        const dto:moderatorDto = {
            email: email,
            admin: false
        }

        const created = new this.moderatorModel(dto);
        
        const result = await created.save();
        this.socket.send("new-moderator",result);
        
        return result;
    }

    async setAdmin(id:string,admin:boolean):Promise<Moderator>{
        const result = await this.moderatorModel.findById(id);
        
        result.admin = admin;
        await result.save();
        this.socket.send("new-admin",result);

        return result;
    }

    async getAll():Promise<Moderator[]>{
        return this.moderatorModel.find({});
    }

    async remove(id:string):Promise<Moderator>{
        return this.moderatorModel.findByIdAndRemove(id);
    }

    async search(term:string):Promise<userSearch[]>{
        let collectionOwners = await this.collectionModel.find({},{"owner":1});
        let downloaders = await this.downloadModel.find({},{"owner":1});
        let authors = await this.myscriptModel.find({},{"author":1});
        const result:userSearch[] = [];
        term = term.toLowerCase();
        
        collectionOwners = collectionOwners.filter((value) => value.owner.name.toLowerCase().indexOf(term) !== -1 || value.owner.email.toLowerCase().indexOf(term) !== -1);
        downloaders = downloaders.filter((value) => value.owner.name.toLowerCase().indexOf(term) !== -1 || value.owner.email.toLowerCase().indexOf(term) !== -1);
        authors = authors.filter((value) => value.author.name.toLowerCase().indexOf(term) !== -1 || value.author.email.toLowerCase().indexOf(term) !== -1);
        
        const temp:string[] = [];

        collectionOwners.forEach(async(value) => {
            if(temp.includes(value.owner.email))
                return;

            temp.push(value.owner.email);
            result.push({
                name: value.owner.name,
                email: value.owner.email,
                collections: await this.collectionModel.find({"owner.email":value.owner.email}).countDocuments(),
                downloads: await this.downloadModel.find({"owner.email":value.owner.email}).countDocuments(),
                authored: await this.automataModel.find({"author.email":value.owner.email}).countDocuments(),
                models: await this.networkModel.find({"creator.email":value.owner.email}).countDocuments()
            })
        })

        downloaders.forEach(async(value) => {
            if(temp.includes(value.owner.email))
                return;

            temp.push(value.owner.email);
            result.push({
                name: value.owner.name,
                email: value.owner.email,
                collections: await this.collectionModel.find({"owner.email":value.owner.email}).countDocuments(),
                downloads: await this.downloadModel.find({"owner.email":value.owner.email}).countDocuments(),
                authored: await this.automataModel.find({"author.email":value.owner.email}).countDocuments(),
                models: await this.networkModel.find({"creator.email":value.owner.email}).countDocuments()
            })
        })

        authors.forEach(async(value) => {
            if(temp.includes(value.author.email))
                return;

            temp.push(value.author.email);
            result.push({
                name: value.author.name,
                email: value.author.email,
                collections: await this.collectionModel.find({"owner.email":value.author.email}).countDocuments(),
                downloads: await this.downloadModel.find({"owner.email":value.author.email}).countDocuments(),
                authored: await this.automataModel.find({"author.email":value.author.email}).countDocuments(),
                models: await this.networkModel.find({"creator.email":value.author.email}).countDocuments()
            })
        });

        return result;
    }

    async countDownloaders():Promise<number>{
        return (await this.downloadModel.distinct("owner.email")).length;
    }

    async countCollectionOwners():Promise<number>{
        return (await this.collectionModel.distinct("owner.email")).length
    }

    async countScriptAuthors():Promise<number>{
        return (await this.myscriptModel.distinct("author.email")).length
    }

    getActiveAccounts():number{
        return this.socket.getUsers();
    }

    getLoggedInUsers():number{
        return this.socket.getLoggedInUsers();
    }

    async getTotalAccounts():Promise<number>{

        const downloaders = await this.downloadModel.distinct("owner.email");
        const authors = await this.myscriptModel.distinct("author.email");
        const collectors = await this.collectionModel.distinct("owner.email");
        
        const temp  = downloaders.concat(...authors).concat(...collectors);
        const result = Array.from(new Set(temp));

        return result.length;
    }
}