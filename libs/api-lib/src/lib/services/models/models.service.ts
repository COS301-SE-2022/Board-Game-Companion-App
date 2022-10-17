import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { NeuralNetwork, NeuralNetworkDocument } from '../../schemas/neural-network.schema';
import { Model } from 'mongoose';
import { user } from '../../models/general/user';
import { neuralnetworkDto } from '../../models/dto/neuralnetworkDto';
import { MemoryStoredFile } from 'nestjs-form-data';
import fs = require("fs");
import { upload } from '../../models/general/upload';
import { NeuralNetworkDiscriminator } from '../../models/general/modelDiscriminator'
import { MongoDbStorageService } from '../mongodb-storage/mongodb-storage.service';
import { fileType } from '../../models/general/fileType';

@Injectable()
export class ModelsService {

    constructor(@InjectModel(NeuralNetwork.name) private networkModel: Model<NeuralNetworkDocument>,
                private readonly storageService:MongoDbStorageService){}

    async create(model:MemoryStoredFile,weights:MemoryStoredFile,user:user,name:string,created:Date,min:number[],max:number[],labels:string[],loss:number,accuracy:number): Promise<NeuralNetwork>{
        const dto:neuralnetworkDto = {
            creator: user,
            name: name,
            created: created,
            labels: labels,
            min: min,
            max: max,
            loss: loss,
            accuracy: accuracy,
            model: {name:model.originalName,key:"",location:""},
            discriminator: NeuralNetworkDiscriminator.None
        }
        
        const createdNetwork = new this.networkModel(dto);
        const result:NeuralNetworkDocument = await createdNetwork.save();
        const data:string[] = [ Buffer.from(model.buffer).toString('base64'),Buffer.from(weights.buffer).toString('base64')];
        
        const savedModel:upload = await this.storageService.upload(model.originalName,fileType.model,data);
        
        result.model.key = savedModel.key;
        result.model.location = savedModel.location;

        result.save();
        
        return result;
    }

    async alreadExists(user:user,name:string):Promise<boolean>{
        const value:NeuralNetwork = await this.networkModel.findOne({"creator.email":user.email,"name":name});
    
        return value !== null && value !== undefined;
    }

    async getAll(user:user):Promise<NeuralNetwork[]>{
        return this.networkModel.find({"creator.name":user.name,"creator.email":user.email,"discriminator":NeuralNetworkDiscriminator.None}).exec();
    }

    async remove(id:string):Promise<boolean>{
        const result = await this.networkModel.findByIdAndRemove(id);
        
        return result !== null && result !== undefined;
    }

    async removeById(id:string):Promise<NeuralNetwork>{
        return this.networkModel.findByIdAndRemove(id);
    }

    async getModel(id:string):Promise<NeuralNetwork>{
        return this.networkModel.findById(id);
    }

    async getModelByName(user:user,name:string):Promise<NeuralNetwork>{
        return this.networkModel.findOne({"creator.email":user.email,"creator.name":user.name,"name":name})
    }

    async getModels(user:user,idList:string[]):Promise<NeuralNetwork[]>{
        return this.networkModel.find({"creator.name":user.name,"creator.email":user.email}).where('_id').in(idList);
    }

    async getModelsByIdOnly(idList:string[]):Promise<NeuralNetwork[]>{
        return this.networkModel.find().where('_id').in(idList);
    }

    async copyModel(id:string,location:NeuralNetworkDiscriminator): Promise<string>{
        const current = await this.networkModel.findById(id);

        if(current === null || current === undefined)
            return "";

        if(location === NeuralNetworkDiscriminator.None || location === current.discriminator)
            return "";

        const dto:neuralnetworkDto = {
            creator: current.creator,
            name: current.name,
            created: new Date(),
            labels: current.labels,
            min: current.min,
            max: current.max,
            loss: current.loss,
            accuracy: current.accuracy,
            model: {name: current.model.name,key: "",location: ""},
            discriminator: location
        }

        const createdNetwork = new this.networkModel(dto);
        const result:NeuralNetworkDocument = await createdNetwork.save();

        const modelUpload = await this.storageService.copy(current.model.key);
        result.model.key = modelUpload.key; 
        result.model.location = modelUpload.location;

        await result.save();
        
        return result._id;
    }

}
