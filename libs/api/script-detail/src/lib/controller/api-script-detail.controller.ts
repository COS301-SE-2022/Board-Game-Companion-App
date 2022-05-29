import { Controller, Body,  Get, Query, Post, Put, Delete, StreamableFile } from '@nestjs/common';
import { ScriptService } from '../service/scripts/script.service';
import { scriptDto } from '../model/dto/scriptDto';
import { createResponse }  from '../model/response/scriptResponse';
import { Script } from '../schema/script.schema';
import { createReadStream } from 'fs';
import { join } from 'path';

@Controller('scripts')
export class ApiScriptDetailController {
    constructor(private readonly scriptService:ScriptService){}
    
    //script functions


    @Get('download')
    downloadScript(@Query('name')name:string):StreamableFile{
        const file = createReadStream(join(process.cwd(),name));
        return new StreamableFile(file);
    }

    @Post('create')
    async createScript(@Body() dto:scriptDto): Promise<createResponse>{ 
        return {success:true,message:"script saved.",content:await this.scriptService.create(dto)}; 
    }

    @Get('retrieve/byid')
    async retrieveScript(@Query('id')id:number): Promise<Script>{
        return await this.scriptService.findById(id);
    }

    @Get('download')
    async download(@Query('id')id:string){
        console.log('retrieveScript');
    }

    @Put('visibility')
    async toggleVisibility(){
        console.log('toggleVisibility');
    }

    @Delete('remove')
    async removeScript(@Body('id')id:string){
       console.log('removeScript'); 
    }
    //rating functions
    
    @Post('create-rating')
    async createUserRating(@Body('user')user:number,@Body('script')scriptId:string,@Body('value')value:number){
        console.log('createUserRating');
    }

    @Get('retrieve-rating')
    async retrieveUserRating(@Query('id')user:number): Promise<Script>{
        return await this.scriptService.findById(user);
    }

    @Put('update-rating')
    async updateUserRating(@Body('id')ratingId:string,@Body('value')value:number){
        console.log('updateRating');
    }

    //comment functions

    @Post('create-comment')
    async createComment(@Body('user')user:string,@Body('content')content:string){
        console.log('createComment');
    }

    @Post('reply-to-comment')
    async createReplyToComment(@Body('comment')commentId:string,@Body('user')user:string,@Body('content')content:string){
        console.log('createToComment');
    }

    @Post('reply-to-reply')
    async createReplyToReply(@Body('comment')replyId:string,@Body('user')user:string,@Body('content')content:string){
        console.log('createReplyToReply');
    }

    @Get('retrieve-comments')
    async retrieveComments(@Query('comments')comments:string[]){
        console.log('retrieveComments');
    }

    @Put('update-comment-content')
    async updateCommentContent(@Body('comment')commentId:string,@Body('content')content:string){
        console.log('updateCommentContent');
    }

    @Put('update-comment-likes')
    async updateCommentLikes(@Body('comment')commentId:string,@Body('likeCount')likeCount:number){
        console.log('updateCommentLikes');
    }

    @Put('update-comment-dislikes')
    async updateCommentDisLikes(@Body('comment')commentId:string,@Body('disLikeCount')DisLikeCount:number){
        console.log('updateCommentDisLikes');
    }
}
