import { Module } from '@nestjs/common';
import { CollectionsController } from './collections/controller/collections.controller';
import { CollectionsService } from './collections/service/collections.service';

@Module({
  controllers: [CollectionsController],
  providers: [CollectionsService],
  exports: [],
})
export class ApiBoardGamesModule {}
