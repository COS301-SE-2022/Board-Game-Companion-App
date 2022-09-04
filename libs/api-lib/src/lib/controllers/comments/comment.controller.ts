import { Controller, Body,  Get, Query, Post, Put, Delete, Req ,UploadedFile, UseInterceptors, Param, HttpException, HttpStatus } from '@nestjs/common';
import { CommentService } from '../../services/comments/comment.service';
import { Comment } from '../../schemas/comment.schema';
import { Like } from '../../schemas/like.schema';
import { commentCount } from '../../models/general/commentCount';
import { user } from '../../models/general/user';


@Controller('comments')
export class ApiCommentController {
    constructor(private readonly commentService:CommentService){}
    
    @Post('create-comment')
    async createComment(@Body('userName')userName:string,@Body('userEmail')userEmail:string,@Body('image')image:string,@Body('script')script:string,@Body('content')content:string): Promise<Comment>{ 
        return this.commentService.createComment({name:userName,email:userEmail},image,script,content);
    }

    @Get('retrieve-all')
    async getComments(@Query('commentsId')commentsId:string):Promise<Comment[]>{

        return this.commentService.getComments(JSON.parse(commentsId));
    }

    @Put('add-reply')
    async addReply(@Body('commentId')commentId:string,@Body('replyId')replyId:string):Promise<void>{
        this.commentService.addReply(commentId,replyId);
    }

    @Get('count-comments')
    async countComments(@Query('id')id:string):Promise<number>{

        return await this.commentService.countComments(id);
    }

    @Post('like')
    async likeComment(@Body('comment')comment:string,@Body('user')user:user,@Body('like')like:boolean):Promise<Like>{
        return this.commentService.like(comment,user,like);
    }

    @Get('count-likes')
    async countLikes(@Query('comment')comment:string):Promise<commentCount>{
        return this.commentService.count(comment);
    }

    @Get('retrieve-like')
    async getLike(@Query('comment')comment:string,@Query('userName')userName:string,@Query('userEmail')userEmail:string):Promise<Like>{
        const result = await this.commentService.getLike(comment,{name:userName,email:userEmail});
        //console.log(comment);
        //console.log(user);
        return result;
    }

    @Delete('remove-like')
    async removeLike(@Query('id')id:string){
        await this.commentService.removeLike(id);
    }
}
