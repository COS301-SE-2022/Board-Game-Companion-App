import { Injectable } from '@nestjs/common';
import { Collection, Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Alert, AlertDocument } from '../../schemas/alert.schema';
import { user } from '../../models/general/user';
import { AutomataScript, AutomataScriptDocument } from '../../schemas/automata-script.schema';
import { OldScript, OldScriptDocument } from '../../schemas/old-script.schema';
import { CollectionDocument } from '../../schemas/collection.schema';
import { DownloadScript, DownloadScriptDocument } from '../../schemas/download-script.schema';
import { MyScript, MyScriptDocument } from '../../schemas/my-script.schema';

@Injectable()
export class AdminService {

    constructor(@InjectModel(AutomataScript.name) private readonly automataModel: Model<AutomataScriptDocument>,
                @InjectModel(MyScript.name) private readonly myscriptModel: Model<MyScriptDocument>,
                @InjectModel(DownloadScript.name) private readonly downloadModel: Model<DownloadScriptDocument>,
                @InjectModel(OldScript.name) private readonly oldModel: Model<OldScriptDocument>,
                @InjectModel(Collection.name)private readonly collectionModel: Model<CollectionDocument>,){}


    async countDownloaders():Promise<number>{
        return (await this.downloadModel.distinct("owner.email")).length;
    }

    async countCollectionOwners():Promise<number>{
        return (await this.collectionModel.distinct("owner.email")).length
    }

    async countScriptAuthors():Promise<number>{
        return (await this.myscriptModel.distinct("author.email")).length
    }
}