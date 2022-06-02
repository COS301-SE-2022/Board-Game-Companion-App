import { Body, Controller, Get, Query, Post } from '@nestjs/common';
import { collection } from '../../schemas/collection'; 
import { CollectionsService } from '../../services/collection/collections.service';

@Controller('collections')
export class CollectionsController {
    
    constructor(private readonly collectionService:CollectionsService) {
        
    }

    @Get('get-collections')
    getCollectionsForUser(@Query('owner') owner:string):Promise<collection[]>{
        return this.collectionService.getCollectionByUser(owner);
    }

    @Post('create-collection')
    async createCollection(@Body('name') name: string,@Body('owner') owner: string, @Body('description') desc:string,@Body('boardgames') games:string[]){
        const newCollection: collection = {
            name: name,
            owner: owner,
            description: desc,
            boardgames: games
        };
        return {message: await this.collectionService.create(newCollection)}; 
    }

    @Post('remove')
    async removeCollection(@Body('name') name: string,@Body('owner') owner: string){
        return {success: await this.collectionService.removeCollection(owner,name)};
    }

    @Post('add-game')
    async addGameToCollection(@Body('owner')owner:string,@Body('name')name:string,@Body('boardgames')game:string){
        return {success: await this.collectionService.addBoardGame(game,name,owner)};
    }
}
