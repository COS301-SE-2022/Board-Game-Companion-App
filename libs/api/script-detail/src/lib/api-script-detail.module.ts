import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ApiScriptDetailController } from './controller/api-script-detail.controller';
import { Script, ScriptSchema } from './schema/script.schema';
import { Comment, CommentSchema } from './schema/comment.schema';
import { Rating, RatingSchema } from './schema/rating.schema';
import { ScriptService } from './service/scripts/script.service';
import { CommentService } from './service/comments/comment.service';

@Module({
  imports: [MongooseModule.forFeature([{name:Script.name,schema: ScriptSchema},{name:Comment.name,schema:CommentSchema},{name:Rating.name,schema:RatingSchema}])],
  controllers: [ApiScriptDetailController],
  providers: [ScriptService],
  exports: [],
})
export class ApiScriptDetailModule {}
