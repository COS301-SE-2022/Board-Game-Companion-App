import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { commentDto } from '../../models/dto/commentDto';
import { Comment,CommentDocument } from '../../schemas/comment.schema';
import { Like, LikeDocument } from '../../schemas/like.schema';
import { commentCount } from '../../models/general/commentCount';
import { user } from '../../models/general/user';

@Injectable()
export class CommentService {

    constructor(@InjectModel(Comment.name) private commentModel: Model<CommentDocument>,@InjectModel(Like.name) private likeModel: Model<LikeDocument>){}

    async createComment(user:user,image:string,script:string,content:string):Promise<Comment>{
        const dto:commentDto = {
            user: user,
            image: image,
            created: new Date(),
            script:script,
            content: content,
            replies: []
        }

        const createdComment = new this.commentModel(dto);
        const result:Comment =  await createdComment.save();
        
        return result;
    }

    async countComments(id:string):Promise<number>{
        return this.commentModel.countDocuments({script:id});
    }
    
    async getComments(commentsId:string[]):Promise<Comment[]>{
        return this.commentModel.find().where('_id').in(commentsId);
    }

    async addReply(commentId:string,replyId:string):Promise<void>{
        const result:CommentDocument = await this.commentModel.findById(commentId);
        let add = true;

        for(let count = 0; count < result.replies.length && add; count++){
            if(result.replies[count] === replyId)
                add = false;
        }

        if(add){
            result.replies.unshift(replyId);
            result.save();
        }
    }

    async like(comment:string,user:user,like:boolean):Promise<Like>{

        let value:LikeDocument = await this.likeModel.findOne({comment:comment,user:user});

        if(value === null){
            const createLike = new this.likeModel({
                comment:comment,
                user:user,
                like:like
            });

            value =  await createLike.save();
        }else{
            value.like = like;
            value.save();
        }

        return value;
    }

    async getLike(comment:string,user:user):Promise<Like>{
        return this.likeModel.findOne({comment:comment,user:user});
    }

    async removeLike(id:string):Promise<void>{
        this.likeModel.findByIdAndDelete(id);
    }

    async count(comment:string):Promise<commentCount>{
        const result:commentCount = {
            likes: 0,
            dislikes: 0,
            replies: 0
        }

        result.likes = await this.likeModel.countDocuments({comment:comment,like:true});
        result.dislikes = await this.likeModel.countDocuments({comment:comment,like:false});
        const com = await this.commentModel.findById(comment);
        
        if(com !== null){
            result.replies = com.replies.length;
        }

        return result;
    }
}
