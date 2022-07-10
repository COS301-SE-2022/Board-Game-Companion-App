import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Rating, RatingDocument } from '../../schemas/rating.schema';
import { scriptDto } from '../../models/dto/scriptDto';

@Injectable()
export class RatingService {
    constructor(@InjectModel(Rating.name) private ratingModel: Model<RatingDocument> ){}

    async rate(user:string,script:string,value:number):Promise<Rating>{
        let result:RatingDocument = await this.ratingModel.findOne({user:user,script:script});

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
        const temp:any = this.ratingModel.aggregate().match({script:script}).group({_id:"$script",average:{$avg : '$value'}}).exec();
        console.log(temp);
        return 0;
    }

    async countRating(script:string):Promise<number>{
        return this.ratingModel.countDocuments({script:script});
    }
}
