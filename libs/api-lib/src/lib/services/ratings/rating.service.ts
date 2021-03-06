import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Rating, RatingDocument } from '../../schemas/rating.schema';
import { scriptDto } from '../../models/dto/scriptDto';
import mongoose from 'mongoose';

@Injectable()
export class RatingService {
    constructor(@InjectModel(Rating.name) private ratingModel: Model<RatingDocument> ){}

    async rate(user:string,script:string,value:number):Promise<Rating>{
        let result:RatingDocument = await this.ratingModel.findOne({user:user,script:script});

        value = Math.min(5,value);
        value = Math.max(0,value);

        if(result === null){
            const createLike = new this.ratingModel({
                user: user,
                script: script,
                value: value
            });

            result =  await createLike.save();
        }else{
            result.value = value;
            result.save();
        }

        return result;        
    }

    async getRating(user:string,script:string):Promise<Rating>{
        return this.ratingModel.findOne({user:user,script:script});
    }

    async average(script:string):Promise<number>{
        const id:mongoose.Types.ObjectId = new mongoose.Types.ObjectId(script);

        const temp:any = await this.ratingModel.aggregate([{$match:{script:id}},{$group: {_id: '$script',sum: { $sum: "$value"}}}]);
        const count: number = await this.countRating(script);

        return Math.floor(temp[0].sum / count);
    }

    async countRating(script:string):Promise<number>{
        const id:mongoose.Types.ObjectId = new mongoose.Types.ObjectId(script);
        return this.ratingModel.countDocuments({script:id});
    }
}
