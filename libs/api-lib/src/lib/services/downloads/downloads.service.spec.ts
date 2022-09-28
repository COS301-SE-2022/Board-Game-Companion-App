import { HttpService } from '@nestjs/axios';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model, Query } from 'mongoose';
import { createMock } from '@golevelup/ts-jest';
import { AutomataScript, AutomataScriptDocument } from '../../schemas/automata-script.schema';
import { DownloadScript, DownloadScriptDocument } from '../../schemas/download-script.schema';
import { FileDocument, File } from '../../schemas/file.schema';
import { NeuralNetwork, NeuralNetworkDocument } from '../../schemas/neural-network.schema';
import { OldScript, OldScriptDocument } from '../../schemas/old-script.schema';
import { ModelsService } from '../models/models.service';
import { MongoDbStorageService } from '../mongodb-storage/mongodb-storage.service';
import { DownloadsService } from './downloads.service';
import { user } from '../../models/general/user';
import { NonNullableFormBuilder } from '@angular/forms';
import { upload } from '../../models/general/upload';

describe('DownloadsService', () => {
  let service: DownloadsService;
  let httpService: HttpService;
  let modelService: ModelsService;
  let networkModel: Model<NeuralNetworkDocument>; //modelService dependency 
  let storageService: MongoDbStorageService;
  let fileModel: Model<FileDocument>; //mongoservice dependency 
  let downloadsModel:Model<DownloadScriptDocument>;
  let automataModel: Model<AutomataScriptDocument>;
  let oldModel: Model<OldScriptDocument>;

  const newUser : user ={
    name: "Beyonce", 
    email: "BeyonceKnowles@gmail.com"
  }

  const mockDownload : DownloadScript = {
    name:"Script12", 
    author:{name:"author1", email:"author1@gmail.com"},
    boardgame: "Monopoly",
    description: "This is monopoly script",
    version: {major: 2, minor:1, patch:3},
    size: 28,
    icon: {name:"iconFile", key:"iconKey", location:"iconLocation"},
    build: {name:"buildFile", key:"iconKey", location:"iconLocation"},
    models:["Model1", "Model2", "Model3"],
    iconSize: 8,//basescript 
    owner: newUser,
    link : 'www.link.com',
    dateDownloaded: new Date("13-09-20"),
  };

  const mockScript: AutomataScript = {
    name: 'Script12',
    author: { name: 'author1', email: 'author1@gmail.com' },
    boardgame: 'Monopoly',
    description: 'This is monopoly script',
    version: { major: 2, minor: 1, patch: 3 },
    size: 28,
    icon: { name: 'iconFile', key: 'iconKey', location: 'iconLocation' },
    build: { name: 'buildFile', key: 'iconKey', location: 'iconLocation' },
    models: ['Model1', 'Model2', 'Model3'],
    iconSize: 8, //basescript
    previous: ["Script11", "Script10"],
    link: "www.link.com", 
    dateReleased: new Date("13-02-16"),
    downloads: 4, 
    lastDownload: new Date("20-02-15"),
    export: true,
    comments: [],
    rating: 3, 
    source: {name:"sourceFile", key:"src123", location:"thisLcation"}
  };
    
  const mockDownloadDoc = (mock?: Partial<DownloadScript>): Partial<DownloadScriptDocument> => ({
    //_id: mock?.id || 'a uuid',
    name: mock?.name || "Script12", 
    author: mock?.author || {name:"author1", email:"author1@gmail.com"},
    boardgame: mock?.boardgame || "Monopoly",
    description: mock?.description || "This is monopoly script",
    version: mock?.version || {major: 2, minor:1, patch:3},
    size: mock?.size || 28,
    icon: mock?.icon || {name:"iconFile", key:"iconKey", location:"iconLocation"},
    build: mock?.build || {name:"buildFile", key:"iconKey", location:"iconLocation"},
    models: mock?.models|| ["Model1", "Model2", "Model3"],
    iconSize: mock?.iconSize || 8,//basescript 
    owner: mock?.owner || newUser,
    link : mock?.link || 'www.link.com',
    dateDownloaded: mock?.dateDownloaded || new Date("13-09-20"),
  });

  const myUpload : upload ={
    location: "iconLocation",
    key: "iconKey" 
  };

  const myNeural : NeuralNetwork={
    creator: newUser,
    name: "Script12",
    created: new Date("29-01-19"),
    accuracy: 60,
    loss: 10,
    type: "script",
    labels: [],
    min: [1,2],
    max: [8,9],
    model: {name:"thisFile", key:"fileKey", location:"./desktop/models"},
    weights: {name:"thisWeights", key:"weightKey", location:"./desktop/weights"},
    discriminator: 5,
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DownloadsService,  {
        provide: ModelsService,
        useValue:{
          removeById: jest.fn(()=>{
            return myNeural
          }),
          copy: jest.fn(async()=>{
            return myUpload;
          }),
          copyModel: jest.fn(async ()=>{
            return "some string response";
          }),
          getModelsByIdOnly: jest.fn(async ()=>{
            return myNeural;
          }),
        }
      }, {
        provide: MongoDbStorageService, 
        useValue: {
          copy: jest.fn(async()=>{
            return myUpload;
          }),
          remove: jest.fn(async()=>{
            return true
          })
        }
      },
      {
        provide: getModelToken(DownloadScript.name), 
        useValue:{
          find: jest.fn( async ()=>{
            return mockDownload
          }),
          findById: jest.fn( async ()=>{
            return mockDownload
          }),
          save: jest.fn( async ()=>{
            return mockScript
          }),
        }
      },
      {
        provide: getModelToken(AutomataScript.name), useValue:{
          findById: jest.fn( async()=>{
            return mockScript
          }),
          save: jest.fn(async()=>{
            return mockScript
          })
        }
      },
      {
        provide: getModelToken(OldScript.name), useValue:{}
      },
      {
        provide:getModelToken(NeuralNetwork.name), useValue:{
          findByIdAndRemove: jest.fn(()=>{
            return myNeural
          })
          
        }
      },
      {
        provide: getModelToken(File.name), useValue:{
          findById: jest.fn( async()=>{
            return mockScript
          })
        }
      },
    {
      provide: HttpService,
          useValue: {
            get: jest.fn(),
            post: jest.fn(),
            patch: jest.fn(),
            put: jest.fn(),
            delete: jest.fn(),
          }
    }],
    }).compile();

    service = module.get<DownloadsService>(DownloadsService);
    httpService= module.get<HttpService>(HttpService);
    modelService= module.get<ModelsService>(ModelsService);
    networkModel= module.get<Model<NeuralNetworkDocument>>(getModelToken(NeuralNetwork.name));
    storageService= module.get<MongoDbStorageService>(MongoDbStorageService);
    fileModel= module.get<Model<FileDocument>>(getModelToken(File.name));
    downloadsModel=module.get<Model<DownloadScriptDocument>>(getModelToken(DownloadScript.name));
    automataModel= module.get<Model<AutomataScriptDocument>>(getModelToken(AutomataScript.name));
    oldModel= module.get<Model<OldScriptDocument>>(getModelToken(OldScript.name));

  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    //expect(httpService).toBeDefined();
    expect(modelService).toBeDefined();
    expect(networkModel).toBeDefined();
    expect(storageService).toBeDefined();
    expect(downloadsModel).toBeDefined();
    expect(automataModel).toBeDefined();
    expect(oldModel).toBeDefined();
    expect(fileModel).toBeDefined();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
  
  it('get downloaded scripts by Id', async()=>{
      jest.spyOn(downloadsModel, 'findById').mockReturnValueOnce(
        createMock<Query<DownloadScriptDocument, DownloadScriptDocument>>({
          exec: jest
            .fn()
            .mockResolvedValueOnce(
              mockDownloadDoc({ name: "Script12" })),
        }) as any,
      );
      const foundScript = await service.retrieveById('Script12');
      expect(JSON.stringify(foundScript)).toEqual(JSON.stringify(mockDownload));
  });

  it('should get the users downloads', async()=>{
    const foundDownload = await service.getMyDownloads(newUser);
    expect(JSON.stringify(foundDownload)).toEqual(JSON.stringify(mockDownload));
  });

  it('should get download information', async()=>{
    const foundInfo = await service.getDownloadInfo("Script12");
    if (foundInfo === undefined || foundInfo === null){
      expect(JSON.stringify(foundInfo)).toBeNull();
    }
    else{
      expect(JSON.stringify(foundInfo)).toEqual(JSON.stringify(mockScript));
    }
  });

  it('should update an old script', async()=>{
      const updateThis = await service.update({oldId:"Script12",newId:"Script12"});
      
      expect(updateThis).toEqual(mockDownload);
      
      const newScript = await automataModel.findById("Script12");

      jest.spyOn(newScript, 'save')

      // if(old === undefined || newScript === undefined || old === null || newScript === null){
      //   expect(old).toBeNull();
      //   expect(newScript).toBeNull();
      // }
      // expect(old).toBeDefined();
      // expect(newScript).toBeDefined();
      // expect(old.description).toEqual(newScript.description);
      // expect(old.version.major).toEqual(newScript.version.major);
      // expect(old.version.minor).toEqual(newScript.version.minor);
      // expect(old.version.patch).toEqual(newScript.version.patch);
      // expect(old.size).toEqual(newScript.size);
      //old.link = newScript._id;
      //expect(old.link).toEqual(newScript._id);
     
      // const buildCopy = await storageService.copy(newScript.build.key);
      // expect(buildCopy).toBeDefined(); 
      //expect(old.build.key).toEqual(buildCopy.key);
      //expect(old.build.location).toEqual(buildCopy.location);

      //for(let x=0; x< old.models.length; x++){
        //const value = old.models;
        //const model = await modelService.removeById(value);
        //expect(model).toBeDefined();

        // if(model !== null || model !== undefined){
        //   expect(storageService.remove(model.model.key)).toBeDefined();
        //   expect(storageService.remove(model.weights.key)).toBeDefined();
        // }
      //}

      
  });


});
