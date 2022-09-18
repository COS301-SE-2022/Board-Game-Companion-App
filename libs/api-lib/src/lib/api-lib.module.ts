import { Module } from '@nestjs/common';
import { CollectionsController } from './controllers/board-collection/collections.controller';
import { ApiCommentController } from './controllers/comments/comment.controller';
import { CollectionsService } from './services/collection/collections.service';
import { EditorService } from './services/editor/editor.service';
import { RatingService } from './services/ratings/rating.service';
import { CommentService } from './services/comments/comment.service';
import { MongooseModule } from '@nestjs/mongoose';
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
import { OldScript, OldScriptSchema } from './schemas/old-script.schema';
import { DownloadScript, DownloadScriptSchema } from './schemas/download-script.schema';
import { AutomataService } from './services/automata/automata.service';
import { ApiAutomataScriptController } from './controllers/automata-scripts/automata-script.controller';
import { ApiEditorController } from './controllers/editor/editor.controller';
import { DownloadsService } from './services/downloads/downloads.service';
import { ApiDownloadScriptController } from './controllers/downloads/downloads.controller';
import { Collection, CollectionSchema } from './schemas/collection.schema';
import { File, FileSchema } from './schemas/file.schema';
import { MongoDbStorageService } from './services/mongodb-storage/mongodb-storage.service';
import { ApiFileManagerController } from './controllers/file-manager/file-manager.controller';
import { Alert, AlertSchema } from './schemas/alert.schema';
import { AlertService } from './services/alert/alert.service';
import { AlertGateway } from './services/alert/alert.gateway';
import { ApiAlertController } from './controllers/alert/alert.controller';

@Module({
  imports:[
    MongooseModule.forFeature([ { name: Collection.name, schema: CollectionSchema},
                                { name: Script.name, schema: ScriptSchema},
                                { name: Comment.name, schema: CommentSchema},
                                { name: Rating.name, schema: RatingSchema},
                                { name: Like.name, schema: LikeSchema},
                                { name: NeuralNetwork.name, schema: NeuralNetworkSchema},
                                { name: Report.name, schema: ReportSchema},
                                { name: MyScript.name, schema: MyScriptSchema},
                                { name: AutomataScript.name, schema: AutomataScriptSchema},
                                { name: OldScript.name, schema: OldScriptSchema},
                                { name: DownloadScript.name, schema: DownloadScriptSchema},
                                { name: File.name, schema: FileSchema},
                                { name: Alert.name, schema: AlertSchema}
                              ]),
                              HttpModule,NestjsFormDataModule
  ],
  controllers: [
    CollectionsController,
    ApiCommentController,
    ApiModelsController,
    ApiReportsController,
    ApiMyScriptController,
    ApiAutomataScriptController,
    ApiEditorController,
    ApiDownloadScriptController,
    ApiFileManagerController,
    ApiAlertController
  ],
  providers: [
    CollectionsService,
    EditorService,
    RatingService,
    CommentService,
    S3Service,
    CompilerService,
    ModelsService,
    LocalStorageService,
    ReportService,
    MyScriptService,
    DownloadsService,
    AutomataService,
    MongoDbStorageService,
    AlertService,
    AlertGateway
  ],
  exports: [
    CollectionsService,
    EditorService,
    RatingService,
    CommentService,
    S3Service,
    CompilerService,
    ModelsService,
    LocalStorageService,
    ReportService,
    MyScriptService,
    DownloadsService,
    AutomataService,
    MongoDbStorageService,
    MongooseModule
  ],
})
export class ApiLibModule {}
