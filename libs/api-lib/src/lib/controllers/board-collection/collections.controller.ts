import { Body, Controller, Get, Query, Post, Delete, Put } from '@nestjs/common';
import { user } from '../../models/general/user';
import { Collection } from '../../schemas/collection.schema';
import { CollectionsService } from '../../services/collection/collections.service';

@Controller('collections')
export class CollectionsController {
    
    constructor(private readonly collectionService:CollectionsService) {
        
    } 

    @Get('get-collections')
    getCollectionsForUser(@Query('ownerName') ownerName:string,@Query('ownerEmail')ownerEmail:string):Promise<Collection[]>{
        return this.collectionService.getCollectionsByUser({name:ownerName,email:ownerEmail});
    }

    @Post('create-collection')
    async createCollection(@Body('name') name: string,@Body('owner') owner: user, @Body('description') desc:string):Promise<Collection>{
        return this.collectionService.create(name,owner,desc); 
    }

    @Delete('remove')
    async removeCollection(@Query('name') name: string,@Query('ownerName')ownerName: string,@Query('ownerEmail')ownerEmail:string):Promise<number>{
        return this.collectionService.removeCollection({name:ownerName,email:ownerEmail},name);
    }

    @Delete('remove-by-id')
    async removeCollectionById(@Query('id')id:string):Promise<number>{
        return this.collectionService.removeCollectionById(id);
    }

    @Put('add-game')
    async addGameToCollection(@Body('owner')owner:user,@Body('name')name:string,@Body('boardgames')game:string):Promise<boolean>{
        return this.collectionService.addBoardGame(game,name,owner);
    }
}
