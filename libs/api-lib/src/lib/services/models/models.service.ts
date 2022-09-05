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
import { NeuralNetworkDiscriminator } from '../../models/general/modelDiscriminator'

@Injectable()
export class ModelsService {

    constructor(@InjectModel(NeuralNetwork.name) private networkModel: Model<NeuralNetworkDocument>,
        private readonly storageService:LocalStorageService){}

    async create(model:MemoryStoredFile,weights:MemoryStoredFile,user:user,name:string,created:Date,type:string,min:number[],max:number[],accuracy?:number,loss?:number,labels?:string[]): Promise<NeuralNetwork>{
        const dto:neuralnetworkDto = {
            creator: user,
            name: name,
            created: created,
            accuracy: accuracy,
            loss: loss,
            type: type,
            labels: labels,
            min: min,
            max: max,
            model: {name:model.originalName,key:"",location:""},
            weights: {name:weights.originalName,key:"",location:""},
            discriminator: NeuralNetworkDiscriminator.None
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
        const value:NeuralNetwork = await this.networkModel.findOne({"creator.email":user.email,"name":name});
    
        return value !== null && value !== undefined;
    }

    async getAll(user:user):Promise<NeuralNetwork[]>{
        return this.networkModel.find({"creator.email":user.email}).exec();
    }

    async remove(user:user,name:string):Promise<boolean>{
        const result = await this.networkModel.deleteOne({"creator.email":user.email,"name":name});
        
        return result.deletedCount === 1;
    }

    async removeById(id:string):Promise<NeuralNetwork>{
        return this.networkModel.findByIdAndRemove(id);
    }

    async getModel(user:user,id:string):Promise<NeuralNetwork>{
        return this.networkModel.findOne({"creator.email":user.email,"creator.name":user.name,"_id":id});
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
            accuracy: current.accuracy,
            loss: current.loss,
            type: current.type,
            labels: current.labels,
            min: current.min,
            max: current.max,
            model: {name: current.model.name,key: "",location: ""},
            weights: {name: current.weights.name,key: "",location: ""},
            discriminator: location
        }

        const createdNetwork = new this.networkModel(dto);
        const result:NeuralNetworkDocument = await createdNetwork.save();

        const modelUpload = this.storageService.copy(current.model.key,"models/" + result._id + "/",result.model.name);
        result.model.key = modelUpload.key; 
        result.model.location = modelUpload.location;

        //console.log(current.weights.key);
        //console.log("models/" + result._id + "/");

        const weightsUpload = this.storageService.copy(current.weights.key,"models/" + result._id + "/",result.weights.name);
        result.weights.key = weightsUpload.key;
        result.weights.location = weightsUpload.location;

        await result.save();
        
        return result._id;
    }

}
