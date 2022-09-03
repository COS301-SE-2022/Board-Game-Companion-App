import { Module } from '@nestjs/common';
import { CollectionsController } from './controllers/board-collection/collections.controller';
import { ApiScriptController } from './controllers/script/script.controller';
import { ApiCommentController } from './controllers/comments/comment.controller';
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
import { Like, LikeSchema } from './schemas/like.schema';
import { NeuralNetwork, NeuralNetworkSchema } from './schemas/neural-network.schema';
import { Report, ReportSchema } from './schemas/report.schema';
import { S3Service } from './services/aws/s3.service';
import { CompilerService } from './services/compiler/compiler.service';
import { ApiModelsController } from './controllers/models/models.controller';
import { ModelsService } from './services/models/models.service';
import { ApiReportsController } from './controllers/report/report.controller';
import { ReportService } from './services/reports/report.service';
import { HttpModule } from '@nestjs/axios';
import { LocalStorageService } from './services/local-storage/local-storage.service';
import { NestjsFormDataModule } from 'nestjs-form-data';
import { MyScript, MyScriptSchema } from './schemas/my-script.schema';
import { MyScriptService } from './services/my-script/my-script.service';
import { ApiMyScriptController } from './controllers/my-scripts/my-script.controller';
import { AutomataScript, AutomataScriptSchema } from './schemas/automata-script.schema';
@Module({
  imports:[
    MongooseModule.forFeature([ { name: 'collection', schema: collectionSchema},
                                { name: Script.name, schema: ScriptSchema},
                                { name: Comment.name, schema: CommentSchema},
                                { name: Rating.name, schema: RatingSchema},
                                { name: Like.name, schema: LikeSchema},
                                { name: NeuralNetwork.name, schema: NeuralNetworkSchema},
                                { name: Report.name, schema: ReportSchema},
                                { name: MyScript.name, schema: MyScriptSchema},
                                { name: AutomataScript.name, schema: AutomataScriptSchema}
                              ]),
                              HttpModule,NestjsFormDataModule
  ],
  controllers: [
    CollectionsController,
    ApiScriptController,
    ApiCommentController,
    ApiModelsController,
    ApiReportsController,
    ApiMyScriptController
  ],
  providers: [
    CollectionsService,
    ScriptEditorService,
    ScriptService,
    RatingService,
    CommentService,
    S3Service,
    CompilerService,
    ModelsService,
    LocalStorageService,
    ReportService,
    MyScriptService
  ],
  exports: [],
})
export class ApiLibModule {}
