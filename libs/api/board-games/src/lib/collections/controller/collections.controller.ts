import { Body, Controller, Get, Query, Post, Delete } from '@nestjs/common';
import { collection } from '../models/collection'; 
import { CollectionsService } from '../service/collections.service';

@Controller('collections')
export class CollectionsController {
    
    constructor(private readonly collectionService:CollectionsService) {
        
    }

    @Get('get-collections')
    getCollectionsForUser(@Query('email') owner:string):collection[]{
        return this.collectionService.getCollectionByUser(owner);
    }

    @Post('create-collection')
    createCollection(@Body('name') name: string,@Body('owner') owner: string, @Body('description') desc:string,@Body('boardgames') games:string[]){
        const newCollection: collection = {
            name: name,
            owner: owner,
            description: desc,
            boardGames: games
        };
        
        return {message: this.collectionService.create(newCollection)}; 
    }

    @Post('remove')
    removeCollection(@Body('name') name: string,@Body('owner') owner: string){
        return {success: this.collectionService.removeCollection(owner,name)};
    }

    @Post('add-game')
    addGameToCollection(@Body('owner')owner:string,@Body('name')name:string,@Body('game')game:string){
        return {success: this.collectionService.addBoardGame(game,name,owner)};
    }
}
