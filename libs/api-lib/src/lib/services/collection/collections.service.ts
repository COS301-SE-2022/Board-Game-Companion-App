import { Injectable, NotFoundException } from '@nestjs/common';
import { Collection,CollectionDocument } from '../../schemas/collection.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { user } from '../../models/general/user';
import { collectionDto } from '../../models/dto/collectionDto';

@Injectable()
export class CollectionsService {

    constructor(@InjectModel(Collection.name)private readonly collectionModel: Model<CollectionDocument>){

    }

    async create(name:string,owner:user,description:string): Promise<Collection>{

        if(owner === null){
            return null;
        }

        if(name === ""){
            return null;
        }
        
        const dto:collectionDto ={
            name: name,
            owner: owner,
            description: description,
            boardgames: []
        }
        
        const createdCollection = new this.collectionModel(dto);

        return createdCollection.save();
    }

    async getCollectionsByUser(owner: user): Promise<Collection[]>{
        return this.collectionModel.find({"owner.name":owner.name,"owner.email":owner.email});
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
}
