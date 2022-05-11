import { Module } from '@nestjs/common';
//import { ApiBoardGamesModule } from '@board-game-companion-app/api/board-games/';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
