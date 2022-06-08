import { Module } from '@nestjs/common';
import { CollectionsController } from './controllers/board-collection/collections.controller';
import { ApiScriptDetailController } from './controllers/script-detail/api-script-detail.controller';
import { ScriptEditorController } from './controllers/script-editor/script-editor.controller';
import { CollectionsService } from './services/collection/collections.service';
import { ScriptService } from './services/scripts/script.service';
import { GoogleAuthService } from './services/GoogleAuth/google-auth.service';
import { ScriptEditorService } from './services/editor/script-editor.service';
import { RatingService } from './services/ratings/rating.service';
import { CommentService } from './services/comments/comment.service';
import { MongooseModule } from '@nestjs/mongoose';
import { collectionSchema } from './schemas/collection';
import { Script, ScriptSchema } from './schemas/script.schema';
import { Comment, CommentSchema } from './schemas/comment.schema';
import { Rating, RatingSchema } from './schemas/rating.schema';
import { MetadataSchema } from './schemas/Metadata';

@Module({
  imports:[
    MongooseModule.forFeature([ { name: 'collection', schema: collectionSchema},
                                {name:Script.name,schema: ScriptSchema},
                                {name:Comment.name,schema:CommentSchema},
                                {name:Rating.name,schema:RatingSchema},
                                { name: 'Metadata', schema: MetadataSchema }
                              ])
  ],
  controllers: [
    CollectionsController,
    ApiScriptDetailController,
    ScriptEditorController
  ],
  providers: [
    CollectionsService,
    ScriptEditorService,
    ScriptService,
    RatingService,
    CommentService,
    GoogleAuthService
  ],
  exports: [],
})
export class ApiLibModule {}
