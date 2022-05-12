import { Module } from '@nestjs/common';
import { CollectionsController } from './collections/controller/collections.controller';
import { CollectionsService } from './collections/service/collections.service';
import { MongooseModule } from '@nestjs/mongoose';
import {collectionSchema } from './collections/models/collection';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'collection', schema: collectionSchema }])],
  controllers: [CollectionsController],
  providers: [CollectionsService],
  exports: [],
})
export class ApiBoardGamesModule {}
