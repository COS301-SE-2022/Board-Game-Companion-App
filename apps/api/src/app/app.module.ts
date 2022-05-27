import { Module } from '@nestjs/common';
import {MongooseModule} from '@nestjs/mongoose';
import { ApiBoardGamesModule } from '@board-game-companion-app/api/board-games';
import { ApiScriptEditorModule } from '@board-game-companion-app/api/script-editor';
import { ApiScriptDetailModule } from '@board-game-companion-app/api/script-detail';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ApiBoardGamesModule,ApiScriptEditorModule,ApiScriptDetailModule,ConfigModule.forRoot(), MongooseModule.forRoot('mongodb://localhost/nest')],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
