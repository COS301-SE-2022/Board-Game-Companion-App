
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model,Query } from 'mongoose';
import { user } from '../../models/general/user';
import { Rating} from '../../schemas/rating.schema';
import { Report, ReportDocument } from '../../schemas/report.schema';
import { createMock } from '@golevelup/ts-jest';
import { HttpModule } from '@nestjs/common';
import { any } from '@tensorflow/tfjs';
import { MyScriptService } from './my-script.service';
import { MyScript, MyScriptDocument } from '../../schemas/my-script.schema';
import { AutomataScript, AutomataScriptDocument } from '../../schemas/automata-script.schema';
import { OldScript, OldScriptDocument } from '../../schemas/old-script.schema';
import { DownloadScript, DownloadScriptDocument } from '../../schemas/download-script.schema';
import { AutomataService } from '../automata/automata.service';
import { ModelsService } from '../models/models.service';
import { MongoDbStorageService } from '../mongodb-storage/mongodb-storage.service';
import { HttpService } from '@nestjs/axios';
import { CollectionsService } from '../collection/collections.service';
import { AlertService } from '../alert/alert.service';
import { CollectionDocument,Collection } from '../../schemas/collection.schema';
import { FileDocument, File } from '../../schemas/file.schema'
import { AlertDocument, Alert } from '../../schemas/alert.schema';
import { NeuralNetworkDocument,NeuralNetwork } from '../../schemas/neural-network.schema';



describe('MyScriptService', () => {
  let service: MyScriptService;
  let model :  Model<MyScriptDocument>;
  let automataModel: Model<AutomataScriptDocument>;
  let oldScriptModel: Model<OldScriptDocument>;
  let downloadsModel:Model<DownloadScriptDocument>;
  let automataService: AutomataService;
  let modelService: ModelsService;
  let httpService: HttpService;
  let storageService: MongoDbStorageService;
  let collectionService: CollectionsService;
  let collectionModel: Model<CollectionDocument>;
  let alertService: AlertService;
  let fileModel: Model<FileDocument>;
  let alertModel: Model<AlertDocument>;
  let networkModel: Model<NeuralNetworkDocument>;

    const user1 : user ={
        name: "user1",
        email: "user1@gmail.com",
    };
    const user2: user ={
        name: "user2",
        email: "user2@gmail.com",
    }

   beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
        providers: [MyScriptService, MongoDbStorageService, CollectionsService, AlertService, HttpService,AutomataService,ModelsService,
            {
                provide: getModelToken(Report.name),
                useValue :
                {
                    constructor: jest.fn(dto =>{
                        return{
                            ...dto
                        }
                    }), 
                    find: jest.fn(),
                    fineById: jest.fn(),
                    findByIdAndDelete: jest.fn(),
                    countDocuments: jest.fn(),
                    distinct: jest.fn(),
                    exec: jest.fn(),
                    save:jest.fn()
                },
            },
            {
              provide: getModelToken(MyScript.name), 
              useValue: {
                constructor: jest.fn(dto =>{
                  return{
                      ...dto
                  }
                }), 
                find: jest.fn(),
                fineById: jest.fn(),
                findByIdAndDelete: jest.fn(),
                countDocuments: jest.fn(),
                distinct: jest.fn(),
                exec: jest.fn(),
                save:jest.fn(),
              },
            },
            {
              provide: getModelToken(OldScript.name), 
              useValue: {
                constructor: jest.fn(),
                find: jest.fn(),
                fineById: jest.fn(),
                findByIdAndDelete: jest.fn(),
                countDocuments: jest.fn(),
                distinct: jest.fn(),
                exec: jest.fn(),
                save:jest.fn(),
              },
            },
            {
              //DownloadScript.name
              provide: getModelToken(DownloadScript.name), 
              useValue: {
                constructor: jest.fn(), 
                find: jest.fn(),
                fineById: jest.fn(),
                findByIdAndDelete: jest.fn(),
                countDocuments: jest.fn(),
                distinct: jest.fn(),
                exec: jest.fn(),
                save:jest.fn(),
              },
            },
            {
              
                provide: getModelToken(Collection.name), 
                useValue: {
                  constructor: jest.fn(), 
                  find: jest.fn(),
                  fineById: jest.fn(),
                  findByIdAndDelete: jest.fn(),
                  countDocuments: jest.fn(),
                  distinct: jest.fn(),
                  exec: jest.fn(),
                  save:jest.fn(),
                },
              
            },
            {
              provide: getModelToken(AutomataScript.name), 
                useValue: {
                  constructor: jest.fn(), 
                  find: jest.fn(),
                  fineById: jest.fn(),
                  findByIdAndDelete: jest.fn(),
                  countDocuments: jest.fn(),
                  distinct: jest.fn(),
                  exec: jest.fn(),
                  save:jest.fn(),
                },
              },
              {
                provide: getModelToken(File.name), 
                useValue: {
                  constructor: jest.fn(), 
                  find: jest.fn(),
                  fineById: jest.fn(),
                  findByIdAndDelete: jest.fn(),
                  countDocuments: jest.fn(),
                  distinct: jest.fn(),
                  exec: jest.fn(),
                  save:jest.fn(),
                },
              },
              {
                //Alert.name
                provide: getModelToken(Alert.name), 
                useValue: {
                  constructor: jest.fn(), 
                  find: jest.fn(),
                  fineById: jest.fn(),
                  findByIdAndDelete: jest.fn(),
                  countDocuments: jest.fn(),
                  distinct: jest.fn(),
                  exec: jest.fn(),
                  save:jest.fn(),
                },
              },
              {
                provide: getModelToken(NeuralNetwork.name), 
                useValue: {
                  constructor: jest.fn(), 
                  find: jest.fn(),
                  fineById: jest.fn(),
                  findByIdAndDelete: jest.fn(),
                  countDocuments: jest.fn(),
                  distinct: jest.fn(),
                  exec: jest.fn(),
                  save:jest.fn(),
                },
              }
        ]
    }).compile();
    service = module.get<MyScriptService>(MyScriptService);
    model = module.get<Model<MyScriptDocument>>(getModelToken(MyScript.name));
    automataModel = module.get<Model<AutomataScriptDocument>>(getModelToken(AutomataScript.name));
    oldScriptModel = module.get<Model<OldScriptDocument>>(getModelToken(OldScript.name));
    downloadsModel = module.get<Model<DownloadScriptDocument>>(getModelToken(DownloadScript.name));
    automataService= module.get<AutomataService>(AutomataService);
    modelService= module.get<ModelsService>(ModelsService);
    httpService= module.get<HttpService>(HttpService);
    storageService= module.get<MongoDbStorageService>(MongoDbStorageService);
    collectionService= module.get<CollectionsService>(CollectionsService);
    alertService= module.get<AlertService>(AlertService);
    collectionModel= module.get<Model<CollectionDocument>>(getModelToken(Collection.name));
    fileModel= module.get<Model<FileDocument>>(getModelToken(File.name));
    alertModel= module.get<Model<AlertDocument>>(getModelToken(Alert.name));
    networkModel= module.get<Model<NeuralNetworkDocument>>(getModelToken(NeuralNetwork.name));
   });

   it('should be defined', () => {
        expect(service).toBeDefined();
        expect(model).toBeDefined();
        // expect( automataModel).toBeDefined();
        // expect( oldScriptModel).toBeDefined();
        // expect( downloadsModel).toBeDefined();
        // expect( automataService).toBeDefined();
        // expect( modelService).toBeDefined();
        // expect( storageService).toBeDefined();
        // expect( collectionService).toBeDefined();
        // expect( alertService).toBeDefined();
        // expect( collectionModel).toBeDefined();
        // expect( fileModel ).toBeDefined();
        // expect(alertModel).toBeDefined();
        // expect(networkModel).toBeDefined();
       
  });

   
});
