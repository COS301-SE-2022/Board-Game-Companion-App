import { Controller, Body,  Get, Query, Post, Put, Delete, Req ,UploadedFile, UseInterceptors, Param, HttpException, HttpStatus } from '@nestjs/common';
import { CommentService } from '../../services/comments/comment.service';
import { Comment } from '../../schemas/comment.schema';
import { Like } from '../../schemas/like.schema';
import { likeCount } from '../../models/general/likeCount';


@Controller('comments')
export class ApiCommentController {
    constructor(private readonly commentService:CommentService){}
    
    @Post('create-comment')
    async createComment(@Body('name')name:string,@Body('image')image:string,@Body('script')script:string,@Body('content')content:string): Promise<Comment>{ 
        return this.commentService.createComment(name,image,script,content);
    }

    @Get('retrieve-all')
    async getComments(@Query('commentsId')commentsId:string):Promise<Comment[]>{

        return this.commentService.getComments(JSON.parse(commentsId));
    }

    @Put('add-reply')
    async addReply(@Body('commentId')commentId:string,@Body('replyId')replyId:string):Promise<void>{
        console.log("reply");
        this.commentService.addReply(commentId,replyId);
    }

    @Get('count-comments')
    async countComments(@Query('id')id:string):Promise<number>{
        return this.commentService.countComments(id);
    }

    @Post('like')
    async likeComment(@Body('comment')comment:string,@Body('user')user:string,@Body('like')like:boolean):Promise<Like>{
        return this.commentService.like(comment,user,like);
    }

    @Get('count-likes')
    async countLikes(@Query('comment')comment:string):Promise<likeCount>{
        return this.commentService.countLikes(comment);
    }

    @Get('retrieve-like')
    async getLike(@Query('comment')comment:string,@Query('user')user:string):Promise<Like>{
        return this.commentService.getLike(comment,user);
    }

    @Delete('remove-like')
    async removeLike(@Query('id')id:string){
        await this.commentService.removeLike(id);
    }
}
