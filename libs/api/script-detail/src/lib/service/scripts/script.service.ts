import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Script, ScriptDocument } from '../../schema/script.schema';
import { scriptDto } from '../../model/dto/scriptDto';

@Injectable()
export class ScriptService {
    constructor(@InjectModel(Script.name) private scriptModel: Model<ScriptDocument>){

    }

    async create(dto: scriptDto): Promise<Script> {
        const createdScript = new this.scriptModel(dto);
        return createdScript.save();
    }

    async findAll(): Promise<Script[]>{
        return this.scriptModel.find().exec();
    }

    async findById(id:number):Promise<Script>{
        return this.scriptModel.findById(id).exec();
    }

    // async findByName(name:string):Promise<Script>{
    //     return this.scriptModel.find({name:'joseph'}).exec();
    // }
}
