import { Module } from '@nestjs/common';
import { CollectionsController } from './controllers/board-collection/collections.controller';
import { ApiScriptController } from './controllers/script/script.controller';
import { ApiCommentController } from './controllers/comments/comment.controller';
import { ScriptEditorController } from './controllers/script-editor/script-editor.controller';
import { CollectionsService } from './services/collection/collections.service';
import { ScriptService } from './services/scripts/script.service';
import { ScriptEditorService } from './services/editor/script-editor.service';
import { RatingService } from './services/ratings/rating.service';
import { CommentService } from './services/comments/comment.service';
import { MongooseModule } from '@nestjs/mongoose';
import { collectionSchema } from './schemas/collection';
import { Script, ScriptSchema } from './schemas/script.schema';
import { Comment, CommentSchema } from './schemas/comment.schema';
import { Rating, RatingSchema } from './schemas/rating.schema';
import { S3Service } from './services/aws/s3.service';

@Module({
  imports:[
    MongooseModule.forFeature([ { name: 'collection', schema: collectionSchema},
                                {name:Script.name,schema: ScriptSchema},
                                {name:Comment.name,schema:CommentSchema},
                                {name:Rating.name,schema:RatingSchema},
                              ])
  ],
  controllers: [
    CollectionsController,
    ApiScriptController,
    ScriptEditorController,
    ApiCommentController
  ],
  providers: [
    CollectionsService,
    ScriptEditorService,
    ScriptService,
    RatingService,
    CommentService,
    S3Service
  ],
  exports: [],
})
export class ApiLibModule {}
