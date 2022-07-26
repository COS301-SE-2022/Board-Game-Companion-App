import { Injectable, NotFoundException } from '@nestjs/common';
import { collection } from '../../schemas/collection';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { user } from '../../models/general/user';

@Injectable()
export class CollectionsService {

    async create(input:collection): Promise<string>{

        if(input.owner === null){
            return "owner of collection needs to be set";
        }
        else if(input.name === ""){
            return "name of collection needs to be set";
        }
        
        const newCollection = new this.collectionModel({
            owner:input.owner,
            name:input.name,
            description:input.description,
            boardgames:input.boardgames,
        });

        const result = await newCollection.save();
        if(!result){
            return "Failed";
        }
        else{
            return "Success";
        }
    }
    constructor(@InjectModel('collection')private collectionModel: Model<collection>){

    }
    async getCollectionByUser(owner: user): Promise<collection[]>{
        const result:collection[] = [];
        let data;
        try{
            data = await this.collectionModel.find({owner:owner});
        }
        catch(error){
            throw new NotFoundException("Internal Server error");
        }
        if(data===null)
        {
            throw new NotFoundException("The collection is not Found");
        }
        for(let count = 0; count < data.length; count++){
            if(owner === data[count].owner){
                result.push(data[count]);
            }
        }
        
        return result;
    }

    async addBoardGame(boardgame:string,name:string,owner:user): Promise<boolean>{
        const result = await this.collectionModel.findOne({owner:owner,name:name});
        if(!result){
            throw new NotFoundException("The collection owner does not exist.");
        }
        if(!result){
            return false;
        }
        else{
            result.boardgames.push(boardgame);
            result.save();
            return true;
        }


    }

    async removeCollection(owner:user,name:string):Promise<boolean>{

        const result = await this.collectionModel.deleteOne({owner:owner,name:name});
        if(result.deletedCount>0){
            return true;
        }
        else{
            throw new NotFoundException("There exist no such owner.");
        }
    }
}
