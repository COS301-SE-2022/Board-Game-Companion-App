import { Module } from '@nestjs/common';
import {MongooseModule} from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { ApiLibModule } from '@board-game-companion-app/api-lib';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';



@Module({
  imports: [
    ApiLibModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'client'),
      exclude: ['/api*'],
    }),
    ConfigModule.forRoot(),

    MongooseModule.forRoot(process.env.PROJECT_STATUS == "development" ? process.env.MONGO_URI_DEV : process.env.MONGO_URI_PROD)
    //
   
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
