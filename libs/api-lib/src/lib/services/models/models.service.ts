import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { NeuralNetwork, NeuralNetworkDocument } from '../../schemas/neural-network.schema';
import { Model } from 'mongoose';
import { user } from '../../models/general/user';
import { neuralnetworkDto } from '../../models/dto/neuralnetworkDto';

@Injectable()
export class ModelsService {

    constructor(@InjectModel(NeuralNetwork.name) private networkModel: Model<NeuralNetworkDocument>){}

    async create(user:user,name:string,created:Date,type:string,min:number[],max:number[],accuracy?:number,loss?:number,labels?:number[]): Promise<NeuralNetwork>{
        const dto:neuralnetworkDto = {
            user: user,
            name: name,
            created: created,
            accuracy: accuracy,
            loss: loss,
            type: type,
            labels: labels,
            min: min,
            max: max
        }
        
        const createdNetwork = new this.networkModel(dto);
        return  createdNetwork.save();
    } 
}
