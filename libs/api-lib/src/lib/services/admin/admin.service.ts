import { Injectable } from '@nestjs/common';
import { Collection, Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { user } from '../../models/general/user';
import { AutomataScript, AutomataScriptDocument } from '../../schemas/automata-script.schema';
import { OldScript, OldScriptDocument } from '../../schemas/old-script.schema';
import { CollectionDocument } from '../../schemas/collection.schema';
import { DownloadScript, DownloadScriptDocument } from '../../schemas/download-script.schema';
import { MyScript, MyScriptDocument } from '../../schemas/my-script.schema';
import { Moderator, ModeratorDocument } from '../../schemas/moderator.schema';
import { moderatorDto } from '../../models/dto/moderatorDto';
import { SocketGateway } from '../socket/socket.gateway';

@Injectable()
export class AdminService {

    constructor(@InjectModel(AutomataScript.name) private readonly automataModel: Model<AutomataScriptDocument>,
                @InjectModel(MyScript.name) private readonly myscriptModel: Model<MyScriptDocument>,
                @InjectModel(DownloadScript.name) private readonly downloadModel: Model<DownloadScriptDocument>,
                @InjectModel(OldScript.name) private readonly oldModel: Model<OldScriptDocument>,
                @InjectModel(Collection.name) private readonly collectionModel: Model<CollectionDocument>,
                @InjectModel(Moderator.name) private readonly moderatorModel: Model<ModeratorDocument>,
                private readonly socket:SocketGateway){}


    async create(email:string):Promise<Moderator>{
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

    async search(term:string):Promise<user[]>{
        const collectionOwners = await this.collectionModel.find({},{"owner":1});
        const Downloaders = await this.downloadModel.find({},{"owner":1});
        const Authors = await this.myscriptModel.find({},{"author":1});
        const result:user[] = [];
        term = term.toLowerCase();

        console.log(collectionOwners);
        // collectionOwners.forEach((value:user) => {
        //     if(value.name.toLowerCase().indexOf(term) !== -1 || value.email.toLowerCase().indexOf(term) !== -1){
        //         result.push(value);
        //     }
        // })

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

    //async isAdmin()
}