import { Injectable, HttpStatus , HttpException } from '@nestjs/common';
import { Collection,CollectionDocument } from '../../schemas/collection.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { user } from '../../models/general/user';
import { collectionDto } from '../../models/dto/collectionDto';
import { AutomataScript, AutomataScriptDocument } from '../../schemas/automata-script.schema';

@Injectable()
export class CollectionsService {

    constructor(@InjectModel(Collection.name)private readonly collectionModel: Model<CollectionDocument>,
                @InjectModel(AutomataScript.name) private automataModel: Model<AutomataScriptDocument>
    ){

    }

    async create(name:string,owner:user): Promise<Collection>{

        if(owner === null){
            return null;
        }

        if(name === ""){
            return null;
        }
        
        const dto:collectionDto ={
            name: name,
            owner: owner,
            boardgames: []
        }
        
        const createdCollection = new this.collectionModel(dto);

        return createdCollection.save();
    }

    async alreadyExist(owner:user,name:string): Promise<boolean>{
        const result = await this.collectionModel.findOne({"owner.name":owner.name,"owner.email":owner.email,"name":name});
        return result !== null && result !== undefined;
    }

    async getCollectionsByUser(owner: user): Promise<Collection[]>{
        return this.collectionModel.find({"owner.name":owner.name,"owner.email":owner.email});
    }

    async getAllCollections():Promise<CollectionDocument[]>{
        return this.collectionModel.find({});
    }

    async addBoardGame(boardgame:string,name:string,owner:user): Promise<boolean>{
        const result = await this.collectionModel.findOne({"owner.name":owner.name,"owner.email":owner.email,"name":name});

        if(result === null || result === undefined)
            return false;

        result.boardgames.push(boardgame);
        
        await result.save();
        return true;
    }

    async removeBoardGame(boardgame:string,name:string,owner:user): Promise<number>{
        const collection = await this.collectionModel.findOne({"owner.name":owner.name,"owner.email":owner.email,"name":name});

        if(collection === null || collection === undefined)
            return 0;

        const result = collection.boardgames.includes(boardgame) ? 1 : 0;

        collection.boardgames = collection.boardgames.filter((value:string) => value !== boardgame);
        
        await collection.save();

        return result;
    }

    async removeCollectionById(id:string):Promise<number>{
        const result = await this.collectionModel.findByIdAndRemove(id);

        return result !== null ? 1 : 0;       
    }



    async removeCollection(owner:user,name:string):Promise<number>{
        const result = await this.collectionModel.findOneAndRemove({"owner.name":owner.name,"owner.email":owner.email,"name":name});

        return result !== null ? 1 : 0;
    }

    async getScripts(id:string):Promise<AutomataScriptDocument[]>{
        const collection = await this.collectionModel.findById(id);
        
        if(collection === null || collection === undefined)
            throw new HttpException("Not Found",HttpStatus.NOT_FOUND);

        let result:AutomataScriptDocument[] = [];

        for(let count = 0; count < collection.boardgames.length; count++){
            const script = await this.automataModel.find({"boardgame":collection.boardgames[count]})
            
            if(script !== null && script !== undefined){
                result = result.concat(...script);
            }
        }

        return result;
    }
}
