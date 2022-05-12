import { Module } from '@nestjs/common';
import {MongooseModule} from '@nestjs/mongoose';
import { ApiBoardGamesModule } from '@board-game-companion-app/api/board-games';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [ApiBoardGamesModule, MongooseModule.forRoot("mongodb+srv://new_forerunner:P3tfeMMw8N1d0Ii8@board-game-companion-ap.wxt0n.mongodb.net/Collections?retryWrites=true&w=majority")],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
