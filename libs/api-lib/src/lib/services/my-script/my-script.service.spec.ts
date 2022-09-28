
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model,Query } from 'mongoose';
import { user } from '../../models/general/user';
import { Rating} from '../../schemas/rating.schema';
import { Report, ReportDocument } from '../../schemas/report.schema';
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
import { SocketGateway } from '../socket/socket.gateway';
import { status } from '../../models/general/status';
import { entity } from '../../models/general/entity';
import { file } from '../../models/general/files';
import { upload } from '../../models/general/upload';
import { version } from '../../models/general/version';


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
 

  const stat: status={
      value: 3,
      message: "The Model is on 3",
  }

    const emptyEntity:entity = {
      type: "",
      name: "",
      startLine: 0,
      endLine: 0,
      startPosition: 0,
      endPosition: 0,
      properties: [],
      children: []
    }
    const myFile : file={
      name: "sourceFile",
      key: "src112",
      location: "./desktop",
    }

    const myVersion : version = {major: 2, minor:1, patch:3}

    const mockUpload : upload ={
      location:"./thisPlace",
      key:"src112222",
    }

    const mockScript: MyScript = {
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
      created: new Date("11-11-20"),
      lastUpdate: new Date("15-08-21"),
      status:stat,
      export: true,
      programStructure:emptyEntity,
      source: {name:"sourceName", key:"src111", location:"./desktop"},
    }
     const mockScriptDoc = (mock?: Partial<MyScript>): Partial<MyScriptDocument> =>({
      name: mock?.name || 'Script12',
      author: mock?.author|| { name: 'author1', email: 'author1@gmail.com' },
      boardgame: mock?.boardgame || 'Monopoly',
      description: mock?.description||'This is monopoly script',
      version: mock?.version||{ major: 2, minor: 1, patch: 3 },
      size: mock?.size || 28,
      icon: mock?.icon|| { name: 'iconFile', key: 'iconKey', location: 'iconLocation' },
      build: mock?.build || { name: 'buildFile', key: 'iconKey', location: 'iconLocation' },
      models: mock?.models ||['Model1', 'Model2', 'Model3'],
      iconSize: mock?.iconSize || 8, //basescript
      created: mock?.created || new Date("11-11-20"),
      lastUpdate: mock?.lastUpdate || new Date("15-08-21"),
      status: mock?.status||stat,
      export: mock?.export || true,
      programStructure:mock?.programStructure || emptyEntity,
      source: mock?.source || {name:"sourceName", key:"src111", location:"./desktop"},
     })
    const mockAutomata: AutomataScript={
      name: 'Script12',
      author: { name: 'author1', email: 'author1@gmail.com' },
      boardgame: 'Monopoly',
      description: 'This is monopoly script',
      version: { major: 2, minor: 1, patch: 3 },
      size: 28,
      icon: { name: 'iconFile', key: 'iconKey', location: 'iconLocation' },
      build: { name: 'buildFile', key: 'iconKey', location: 'iconLocation' },
      models: ['Model1', 'Model2', 'Model3'],
      iconSize: 8,
      previous: ["automata1"],
      link: "www.link.com",
      dateReleased: new Date("11-02-19"),
      downloads: 14,
      lastDownload: new Date("20-06-21"),
      export: true,
      comments: [],
      rating: 0,
      source: {name:"sourceName", key:"src112", location:"./desktop"}
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
      source:mock?.source||myFile,
    });

   beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
        providers: [MyScriptService, MongoDbStorageService, {
          provide: CollectionsService, 
          useValue:{
            getAllCollections: jest.fn(()=>{
              return mockAutDoc
            })
          }}, AlertService,AutomataService,ModelsService, SocketGateway,
            {
              provide:HttpService,
              useValue:{}
            },
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
                findByIdAndRemove: jest.fn((id)=>{
                  return mockScriptDoc;
                }),
                countDocuments: jest.fn(),
                distinct: jest.fn(),
                exec: jest.fn(),
                save: jest.fn(()=>{
                  return mockScriptDoc
                }),
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
                  relegate: jest.fn(()=>{
                    return mockAutomata
                  }),
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
        expect( automataModel).toBeDefined();
        expect( oldScriptModel).toBeDefined();
        expect( downloadsModel).toBeDefined();
        expect( automataService).toBeDefined();
        expect( modelService).toBeDefined();
        expect( storageService).toBeDefined();
        expect( collectionService).toBeDefined();
        expect( alertService).toBeDefined();
        expect( collectionModel).toBeDefined();
        expect( fileModel ).toBeDefined();
        expect(alertModel).toBeDefined();
        expect(networkModel).toBeDefined();
       
  });

  describe('create', ()=>{
    it('should create the users script', async()=>{
      const result = service.create(user1,"script12","monopoly",stat,"some description", "iicon.png");
     
      expect(result).resolves.toEqual(mockScript);
    })
  });

  describe('getMyScriptInfo', ()=>{
    it('should get script info', async()=>{
      expect(service.getMyScriptInfo("some Id")).resolves.toEqual(mockAutomata)
    });
  });

  describe("remove", ()=>{
    it('should remove a script', async()=>{
      const result = service.remove("some ID");
      expect(result).resolves.toBeDefined();
      
      if(result === null || result===undefined){
        expect(result).resolves.toBeNull()
      }
    });
  });


  describe('createSourceFile', ()=>{
    it('should create a source file', async()=>{
      expect(service.createSourceFile("someID")).resolves.toEqual(myFile);
    });
  });

  describe('createBuildFile', ()=>{
    it('should create a build file', async()=>{
      expect(service.createBuildFile("some ID")).resolves.toEqual(myFile);
    });
  });

  describe('storeIcon', ()=>{
    it('should store icons', async()=>{
      expect(service.storeIcon("someID", "icon.png")).resolves.toEqual(mockUpload)
      expect(service.storeIcon("someID", "icon.png")).toBeDefined();
    });
  });

  describe('getAll', ()=>{
    it('should get all scripts', async()=>{
      expect(service.getAll()).resolves.toEqual([mockScript])
    })
  });

  describe('getAllMyScript', ()=>{
    it('should get all scripts', async()=>{
      expect(service.getAllMyScript(user2)).resolves.toEqual([mockScript])
    })
  });

   describe('formatDate', ()=>{
    it('should format the date', ()=>{
      const date = new Date("11-01-18");
      const result = service.formatDate(date);
      expect(result).toEqual("1 November 2018, 0:0:0")
    });
   });
   
  describe('checkName', ()=>{
    it('should chack name of script', async()=>{
      const result = service.checkName("script12", user2);
      if (result === null){
        expect(result).resolves.not.toBeNull();
      }else{
        expect(result).resolves.toEqual(true)
      }
    })
  });

  describe('update', ()=>{
    it('should update the script', async()=>{
      expect(service.update("script12", true,"This is description")).resolves.toEqual(mockScript)
    })
  });

  describe('getMyScriptById', ()=>{
    it('should update the script', async()=>{
      expect(service.getMyScriptById("script12")).resolves.toEqual(mockScript)
    })
  });

  describe('release', ()=>{
    it('should release the script', async()=>{
      expect(service.release("some ID",myVersion )).resolves.toEqual(true);
    })
  });

  describe('retrieveAllScripts', ()=>{
    it('should retrieve all the script', async()=>{
      expect(service.retrieveAllScripts()).resolves.toEqual([mockScript]);
    })
  });

  describe('importAutomata', ()=>{
    it('should import automata script', async()=>{
      expect(service.importAutomata("some ID", user2)).resolves.toEqual(mockScript);
    })
  });


});
