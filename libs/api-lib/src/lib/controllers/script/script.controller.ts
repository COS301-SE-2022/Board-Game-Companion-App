import { Controller, Body,  Get, Query, Post, Put, Delete, StreamableFile,UploadedFile, UseInterceptors } from '@nestjs/common';
import { ScriptService } from '../../services/scripts/script.service';
import { createResponse }  from '../../models/response/scriptResponse';
import { Script } from '../../schemas/script.schema';
import { createReadStream } from 'fs';
import { join } from 'path';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import path = require('path');

let id = uuidv4();

@Controller('scripts')
export class ApiScriptController {
    private id:string;
    constructor(private readonly scriptService:ScriptService){}
    
    //script functions
    updateId():void{
        id = uuidv4();
    }

    @Get('download')
    downloadScript(@Query('name')name:string):StreamableFile{
        const file = createReadStream(join(process.cwd(),name));
        return new StreamableFile(file);
    }

    @Post('create-script')
    @UseInterceptors(FileInterceptor('icon',{
        storage: diskStorage({
            destination:"./uploads/scripts/icons/"+id+"/",
                filename: (req, file, cb) => {
                    const filename: string = path.parse(file.originalname).name.replace(/\s/g, '');
                    const extension: string = path.parse(file.originalname).ext;
      
                    cb(null, `${filename}${extension}`)
                }
          })
        }))
    async createScript(@Body('user')user:string,@Body('name')name:string,@Body('boardGameId')boardGameId:string,@Body('files')files:string,@UploadedFile()icon): Promise<Script>{ 
        const tempId = id;
        this.updateId();
        
        return this.scriptService.create(user,name,boardGameId,JSON.parse(files),icon.path,tempId); 
    }

    @Get('retrieve/byid')
    async retrieveScript(@Query('id')id:number): Promise<Script>{
        return await this.scriptService.findById(id);
    }

    @Get('retrieve/all')
    async retrieveAllScripts():Promise<Script[]>{
        return await this.scriptService.findAll();
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
