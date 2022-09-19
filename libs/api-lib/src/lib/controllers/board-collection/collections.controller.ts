import { Body, Controller, Get, Query, Post, Delete, Put } from '@nestjs/common';
import { user } from '../../models/general/user';
import { AutomataScriptDocument } from '../../schemas/automata-script.schema';
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
    async createCollection(@Body('name') name: string,@Body('owner') owner: user):Promise<Collection>{
        return this.collectionService.create(name,owner); 
    }

    @Delete('remove')
    async removeCollection(@Query('name') name: string,@Query('ownerName')ownerName: string,@Query('ownerEmail')ownerEmail:string):Promise<number>{
        return this.collectionService.removeCollection({name:ownerName,email:ownerEmail},name);
    }

    @Delete('remove-board-game')//(boardgame:string,name:string,owner:user)
    async removeBoardGame(@Query('game')game:string,@Query('name')name:string,@Query('ownerName')ownerName:string,@Query('ownerEmail')ownerEmail:string):Promise<number>{
        return this.collectionService.removeBoardGame(game,name,{name:ownerName,email:ownerEmail});
    }

    @Delete('remove-by-id')
    async removeCollectionById(@Query('id')id:string):Promise<number>{
        return this.collectionService.removeCollectionById(id);
    }

    @Put('add-game')
    async addGameToCollection(@Body('owner')owner:user,@Body('name')name:string,@Body('game')game:string):Promise<boolean>{
        return this.collectionService.addBoardGame(game,name,owner);
    }

    @Get('get-scripts')
    async getScripts(@Query('id')id:string):Promise<AutomataScriptDocument[]>{
        return this.collectionService.getScripts(id);
    }

    @Get('already-exist')
    async alreadyExists(@Query('ownerName')ownerName:string,@Query('ownerEmail')ownerEmail:string,@Query('name')name:string):Promise<boolean>{
        return this.collectionService.alreadyExist({name:ownerName,email:ownerEmail},name);
    }
}
