import { Controller, Body,  Get, Query, Post, Put, Delete, Req ,UploadedFile, UseInterceptors, Param, HttpException, HttpStatus } from '@nestjs/common';
import { CommentService } from '../../services/comments/comment.service';
import { Comment } from '../../schemas/comment.schema';


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
}
