import { Test, TestingModule } from '@nestjs/testing';
import { AutomataService } from './automata.service'; 
import { getModelToken } from '@nestjs/mongoose';
import { Model, Query } from 'mongoose';
import { AutomataScript, AutomataScriptDocument } from '../../schemas/automata-script.schema';
import { OldScript, OldScriptDocument } from '../../schemas/old-script.schema';
import { DownloadScript, DownloadScriptDocument } from '../../schemas/download-script.schema';
import { user } from '../../models/general/user';
import { file } from '../../models/general/files';
import fs = require('fs');
import { ModelsService } from '../models/models.service';
import { MongoDbStorageService } from '../mongodb-storage/mongodb-storage.service';
import { NeuralNetwork } from '../../schemas/neural-network.schema';
import { File } from '../../schemas/file.schema'
import { createMock } from '@golevelup/ts-jest';
import { downloadScriptDto } from '../../models/dto/downloadScriptDto';
import { NeuralNetworkDiscriminator } from '../../models/general/modelDiscriminator';
import { version } from '../../models/general/version';

/*************************************************unit test**********************************************/
describe('AutomataService', ()=>{
  let service: AutomataService; 
  let dbService : MongoDbStorageService;
  let modelService: ModelsService;
  let automataModel:  Model<AutomataScriptDocument>;
  let oldModel : Model<OldScriptDocument>;
  let downloadModel : Model<DownloadScriptDocument>;
  

  const userAuth : user ={
    name:"author1", 
    email:"author1@gmail.com"
  }
  const mySource : file ={
    name: "sourceFile",
    key:"key6389",
    location: "thisLocation"
  };

  const oldVersion: version={major: 1, minor:0, patch:3};

  const newVersion: version={major: 2, minor:1, patch:3}; 

  const mockAutomata : AutomataScript = {
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
    previous: ["Script10","Script11", "Script09"],
    link: "www.somelink.com", 
    dateReleased: new Date("02-09-21"),
    downloads: 11,
    lastDownload: new Date("13-01-22"),
    export: true, 
    comments: [],
    rating: 4,
    source: mySource,
  }

  const mockOld : OldScript ={
    name:"Script10", 
    author:{name:"author1", email:"author1@gmail.com"},
    boardgame: "Monopoly",
    description: "This is monopoly script",
    version: {major: 1, minor:0, patch:3},
    size: 28,
    icon: {name:"iconFile", key:"iconKey", location:"iconLocation"},
    build: {name:"buildFile", key:"iconKey", location:"iconLocation"},
    models:["Model1", "Model2", "Model3"],
    iconSize: 8,//basescript
    previous: ["Script09"],
    dateReleased: new Date("02-07-17"),
    downloads: 11,
    lastDownload: new Date("13-09-17"),
    export: true, 
    comments: [],
    rating: 3,
    source: {name:"sourceFile", key:"scrp4555", location:"./desktop/scripts/old"}, 
  }
  const mockAutDoc = (mock?: Partial<AutomataScript>): Partial<AutomataScriptDocument> => ({
    name: mock?.name || "Script12", 
    author: mock?.author || {name:"author1", email:"author1@gmail.com"},
    boardgame: mock?.boardgame || "Monopoly",
    description: mock?.description || "This is monopoly script",
    version:mock?.version || {major: 2, minor:1, patch:3},
    size: mock?.size || 28,
    icon: mock?.icon|| {name:"iconFile", key:"iconKey", location:"iconLocation"},
    build: mock?.build || {name:"buildFile", key:"iconKey", location:"iconLocation"},
    models:mock?.models||["Model1", "Model2", "Model3"],
    iconSize: mock?.iconSize||8,//basescript 
    previous: mock?.previous||["Script10","Script11", "Script09"],
    link: mock?.link || "www.somelink.com", 
    dateReleased:mock?.dateReleased|| new Date("02-09-21"),
    downloads : mock?.downloads||11,
    lastDownload: mock?.lastDownload ||new Date("13-01-22"),
    export: mock?.export || true, 
    comments: mock?.comments || [],
    rating: mock?.rating ||4,
    source:mock?.source||mySource,
  });

  const MockDownloaded : DownloadScript ={
    name:"Script12", 
    author:{name:"author1", email:"author1@gmail.com"},
    boardgame: "Monopoly",
    description: "This is monopoly script",
    version: {major: 2, minor:1, patch:3},
    size: 28,
    icon: {name:"iconFile", key:"iconKey", location:"iconLocation"},
    build: {name:"buildFile", key:"iconKey", location:"iconLocation"},
    models: ["Model1", "Model2", "Model3"],
    iconSize: 8,//basescript 
    owner: userAuth,
    link: "thisLink.com",
    dateDownloaded: new Date("03-04-21"),
  }
  
  beforeEach(async ()=>{
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        AutomataService, ModelsService,MongoDbStorageService, 
        {
          provide: getModelToken(AutomataScript.name), 
          useValue:{
            new: jest.fn(),
            constructor: jest.fn(),
            find: jest.fn(()=>{
              return mockAutomata
            }),
            findOne: jest.fn(),
            findById: jest.fn(),
            findByIdAndRemove: jest.fn(),
          }
        },
        {
          provide:getModelToken(OldScript.name), 
          useValue:{
            new: jest.fn(),
            constructor: jest.fn(),
            find: jest.fn(()=>{
              return mockOld
            }),
            findById: jest.fn(),
            update: jest.fn(),
          }
        },
        {
          provide: getModelToken(DownloadScript.name),
          useValue: {}
        },
        {
          provide: getModelToken(NeuralNetwork.name),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            findByIdAndRemove: jest.fn(),
            deleteOne: jest.fn(),
            update: jest.fn(),
            create: jest.fn(),
            remove: jest.fn(),
            exec: jest.fn(),
          }
        },
        {
          provide: getModelToken(File.name),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            findByIdAndRemove: jest.fn(),
            deleteOne: jest.fn(),
            update: jest.fn(),
            create: jest.fn(),
            remove: jest.fn(),
            exec: jest.fn(),
          }
        }, 
        {
          provide: getModelToken(DownloadScript.name),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            findByIdAndRemove: jest.fn(),
            deleteOne: jest.fn(),
            update: jest.fn(),
            create: jest.fn(),
            remove: jest.fn(),
            exec: jest.fn(),
          }
        },
      ],
    }).compile();

     service= moduleRef.get<AutomataService>(AutomataService); 
     dbService= moduleRef.get<MongoDbStorageService>(MongoDbStorageService);
     automataModel=  moduleRef.get<Model<AutomataScriptDocument>>(getModelToken(AutomataScript.name));
     oldModel = moduleRef.get<Model<OldScriptDocument>>(getModelToken(OldScript.name));
     downloadModel = moduleRef.get<Model<DownloadScriptDocument>>(getModelToken(DownloadScript.name));
     

  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(dbService).toBeDefined();
    expect(automataModel).toBeDefined();
    expect(oldModel).toBeDefined();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAll', ()=>{
    it('should return all scripts', async()=>{
      return service.getAll().then(data=>{
      expect(data.toString()).toBe(([mockAutomata]).toString());
    });
    });
  });

  describe('getAllOld', ()=>{
    it('should return all old scripts', async()=>{
      return service.getAllOld().then(data=>{
      expect(data.toString()).toBe(([mockOld]).toString());
      });
    });
  });

  // describe('getByGame', ()=>{
  //   it('should return a game', async()=>{
  //     return service.getByGame("some ID").then(data=>{
  //     expect(data.toString()).toBe(mockAutomata.toString());
  //     });
  //   });
  // });

  // describe('download', ()=>{
  //   it('should download a script', async()=>{
  //     return service.download("some ID", userAuth).then(data=>{
  //     expect(data.toString()).toBe(MockDownloaded.toString());
  //     });
  //   });
  // });
 
  // describe('getOldVersions', ()=>{
  //   it('should get versions of the older scripts', async()=>{
  //     return service.getOldVersions(["Script10"]).then(data=>{
  //     expect(data.toString()).toBe(([mockOld]).toString());
  //     });
  //   });
  // });

  // describe('getAutomataScript', ()=>{
  //   it('should get specified automata', async()=>{
  //     return service.getAutomataScript("script12", userAuth).then(data=>{
  //       expect(data.toString()).toBe(mockAutomata.toString())
  //     });
  //   });
  // });

  describe('addComment', ()=>{
    it('should add a comment', async()=>{
      expect(service.addComment).toBeTruthy();
    })
  });

  // describe('getScriptById', ()=>{
  //   it('should get specified script', async()=>{
  //     service.getScriptById("some ID").then(data=>{
  //     expect(data.toString()).toBe(mockAutomata.toString());
  //     });
  //   });
  // });

  // describe('remove', ()=>{
  //   it('should remove automata scriots', async()=>{
  //     expect(service.remove("some ID")).resolves.toBeDefined()
  //   });
  // });

  // describe('checkVersion', ()=>{
  //   it('should check for version type', ()=>{
  //     expect(service.checkVersion(oldVersion,newVersion)).toEqual(true)
  //   });
  // });

  // describe('checkForUpdatesForOne', ()=>{
  //   it('should check for updated version', async()=>{
  //     expect(service.checkForUpdatesForOne("some ID")).resolves.toEqual("This is the newest version")
  //   });
  // });
});

  

  


