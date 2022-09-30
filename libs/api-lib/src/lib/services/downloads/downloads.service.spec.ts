import { HttpService } from '@nestjs/axios';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model, Query } from 'mongoose';
import { AutomataScript, AutomataScriptDocument } from '../../schemas/automata-script.schema';
import { DownloadScript, DownloadScriptDocument } from '../../schemas/download-script.schema';
import { FileDocument, File } from '../../schemas/file.schema';
import { NeuralNetwork, NeuralNetworkDocument } from '../../schemas/neural-network.schema';
import { OldScript, OldScriptDocument } from '../../schemas/old-script.schema';
import { ModelsService } from '../models/models.service';
import { MongoDbStorageService } from '../mongodb-storage/mongodb-storage.service';
import { DownloadsService } from './downloads.service';
import { user } from '../../models/general/user';
import { upload } from '../../models/general/upload';
import { version } from '../../models/general/version';
import { update } from '../../models/general/update';

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

  const authUser: user ={
    name:"author1" ,
    email: "author1@gmail.com",
  }

  const myVersion: version = {major: 2, minor:1, patch:3}

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
    
  const myUpload : upload ={
    location: "iconLocation",
    key: "iconKey" 
  };

  const myUpdate : update ={
    oldId: "oldID",
    newId: "newID"
  }

  const myNeural : NeuralNetwork={
    creator: newUser,
    name: "Script12",
    created: new Date("29-01-19"),
    labels: [],
    min: [1, 2],
    max: [8, 9],
    model: { name: "thisFile", key: "fileKey", location: "./desktop/models" },
    weights: { name: "thisWeights", key: "weightKey", location: "./desktop/weights" },
    discriminator: 5,
    loss: 0,
    accuracy: 0
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
  
  describe('alreadyDownloaded', ()=>{
    it('should check for already downloaded scripts', async()=>{
      expect(service.alreadyDownloaded(newUser,authUser, "script12",myVersion )).resolves.toEqual(true)
    });
  });
 
  describe('update', ()=>{
    it('should update the downloads', async()=>{
      expect(service.update(myUpdate)).resolves.toEqual(mockDownload)
    });
  });

  describe('getDownloadInfo', ()=>{
    it('should return download information', async()=>{
      expect(service.getDownloadInfo("some ID")).resolves.toEqual(mockScript)
    });
  });

  describe('getMyDownloads', ()=>{
    it('should get all downloads', async()=>{
      expect(service.getMyDownloads(newUser)).resolves.toEqual([mockDownload])
    });
  });

  describe('getAll', ()=>{
    it('should get all downloads', async()=>{
      expect(service.getAll()).resolves.toEqual([mockDownload])
    });
  }); 

  describe('retrieveById', ()=>{
    it('should get a download by ID', async()=>{
      expect(service.retrieveById("some ID")).resolves.toEqual(mockDownload)
    });
  });

  describe('removeScript', ()=>{
    it('should remove a script', async()=>{
      expect(service.removeScript("some ID")).resolves.toBeDefined();
    })
  });
});
