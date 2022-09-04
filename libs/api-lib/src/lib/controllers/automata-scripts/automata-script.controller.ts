import { Controller, Body,  Get, Query, Post, Put, Delete ,UploadedFile, UseInterceptors, Param, HttpException, HttpStatus } from '@nestjs/common';
import { status } from '../../models/general/status';
import { user } from '../../models/general/user';
import { AutomataScript } from '../../schemas/automata-script.schema';
import { RatingService } from '../../services/ratings/rating.service';
import { AutomataService } from '../../services/automata/automata.service';
import { Rating } from '../../schemas/rating.schema';

@Controller('automata-scripts')
export class ApiAutomataScriptController {
    constructor(private readonly automataService:AutomataService,
        private readonly ratingService:RatingService){}
    
    @Get('retreive-all')
    async getAll():Promise<AutomataScript[]>{
        return this.automataService.getAll();
    }

    @Put('add-comment')
    async addComment(@Body('scriptId')scriptId:string,@Body('commentId')commentId:string):Promise<void>{
        this.automataService.addComment(scriptId,commentId);
    }    

    @Post('rate')
    async createUserRating(@Body('user')user:user,@Body('script')script:string,@Body('value')value:number):Promise<Rating>{
        return this.ratingService.rate(user,script,value);
    }

    @Get('retrieve-rating')
    async retrieveUserRating(@Query('userName')userName:string,@Query('userEmail')userEmail:string,@Query('script')script:string): Promise<Rating>{
        return this.ratingService.getRating({name:userName,email:userEmail},script);
    }

    @Get('count-rating')
    async countRating(@Query('script')script:string): Promise<number>{
        return this.ratingService.countRating(script);
    }

    @Get('average-rating')
    async averateRating(@Query('script')script:string): Promise<number>{
        return this.ratingService.average(script);
    }
}
