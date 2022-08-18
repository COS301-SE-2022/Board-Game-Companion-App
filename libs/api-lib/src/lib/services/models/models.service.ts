import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { NeuralNetwork, NeuralNetworkDocument } from '../../schemas/neural-network.schema';
import { Model } from 'mongoose';
import { user } from '../../models/general/user';
import { neuralnetworkDto } from '../../models/dto/neuralnetworkDto';
import { MemoryStoredFile } from 'nestjs-form-data';
import fs = require("fs");
import { LocalStorageService } from '../local-storage/local-storage.service'
import { upload } from '../../models/general/upload';

@Injectable()
export class ModelsService {

    constructor(@InjectModel(NeuralNetwork.name) private networkModel: Model<NeuralNetworkDocument>,
        private readonly storageService:LocalStorageService){}

    async create(model:MemoryStoredFile,weights:MemoryStoredFile,user:user,name:string,created:Date,type:string,min:number[],max:number[],accuracy?:number,loss?:number,labels?:string[]): Promise<NeuralNetwork>{
        const dto:neuralnetworkDto = {
            user: user,
            name: name,
            created: created,
            accuracy: accuracy,
            loss: loss,
            type: type,
            labels: labels,
            min: min,
            max: max,
            model: {name:model.originalName,key:"",location:""},
            weights: {name:weights.originalName,key:"",location:""}
        }
        
        const createdNetwork = new this.networkModel(dto);
        const result:NeuralNetworkDocument = await createdNetwork.save();
        const savedModel:upload = await this.storageService.upload(model.originalName,"models/" + result._id + "/",model.buffer);
        const savedWeights:upload = await this.storageService.upload(weights.originalName,"models/" + result._id + "/",weights.buffer);
        
        result.model.key = savedModel.key;
        result.model.location = savedModel.location;

        result.weights.key = savedWeights.key;
        result.weights.location = savedWeights.location;
        result.save();

        return result;
    }

    async alreadExists(user:user,name:string):Promise<boolean>{
        const value:NeuralNetwork = await this.networkModel.findOne({user:user,name:name});
        
        return value !== null;
    }

    async getAll(user:user):Promise<NeuralNetwork[]>{
        return this.networkModel.find({"user.email":user.email}).exec();
    }
}
