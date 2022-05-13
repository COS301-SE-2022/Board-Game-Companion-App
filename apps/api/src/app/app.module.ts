import { Module } from '@nestjs/common';
import {MongooseModule} from '@nestjs/mongoose';
import { ApiBoardGamesModule } from '@board-game-companion-app/api/board-games';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ApiBoardGamesModule,ConfigModule.forRoot(), MongooseModule.forRoot(process.env.MongoDB_URI)],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
