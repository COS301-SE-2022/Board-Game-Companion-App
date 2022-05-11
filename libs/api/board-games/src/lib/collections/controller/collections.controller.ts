import { Controller, Get, Query } from '@nestjs/common';
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

    // Post('create-collection')
    // createCollection()
}
