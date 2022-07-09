import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { commentDto } from '../../models/dto/commentDto';
import { Comment,CommentDocument } from '../../schemas/comment.schema';

@Injectable()
export class CommentService {

    constructor(@InjectModel(Comment.name) private commentModel: Model<CommentDocument>){}

    async createComment(name:string,image:string,script:string,content:string):Promise<Comment>{
        const dto:commentDto = {
            name: name,
            image: image,
            created: new Date(),
            script:script,
            likes: 0,
            dislikes: 0,
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
}
