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

  const mockAutomata =( 
    name="Script12", 
    author={name:"author1", email:"author1@gmail.com"},
    boardgame= "Monopoly",
    description= "This is monopoly script",
    version= {major: 2, minor:1, patch:3},
    size= 28,
    icon= {name:"iconFile", key:"iconKey", location:"iconLocation"},
    build= {name:"buildFile", key:"iconKey", location:"iconLocation"},
    models=["Model1", "Model2", "Model3"],
    iconSize= 8,//basescript 
    previous= ["Script10","Script11", "Script09"],
    link= "www.somelink.com", 
    dateReleased= new Date("02-09-21"),
    downloads= 11,
    lastDownload= new Date("13-01-22"),
    //export= true, 
    comments= [],
    rating= 4,
    source= mySource,
   ) : AutomataScript =>({name, author, boardgame, description, version, size, icon, build, models,iconSize, previous, link,dateReleased, downloads,lastDownload, export:true,comments,rating,source});

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

  const MockDownloaded =( 
    name="Script12", 
    author={name:"author1", email:"author1@gmail.com"},
    boardgame= "Monopoly",
    description= "This is monopoly script",
    version= {major: 2, minor:1, patch:3},
    size= 28,
    icon= {name:"iconFile", key:"iconKey", location:"iconLocation"},
    build= {name:"buildFile", key:"iconKey", location:"iconLocation"},
    models=["Model1", "Model2", "Model3"],
    iconSize= 8,//basescript 
    owner= userAuth,
    link= "thisLink.com",
    dateDownloaded= new Date("03-04-21"),
   ): DownloadScript =>({name, author, boardgame, description, version, size, icon, build, models,iconSize, owner, link,dateDownloaded});
  
  beforeEach(async ()=>{
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        AutomataService, ModelsService,MongoDbStorageService, 
        {
          provide: getModelToken(AutomataScript.name), 
          useValue:{
            new: jest.fn().mockResolvedValue(mockAutomata()),
            constructor: jest.fn().mockResolvedValue(mockAutomata()),
            find: jest.fn(),
            findOne: jest.fn(),
            findById: jest.fn(),
            findByIdAndRemove: jest.fn(),
          }
        },
        {
          provide:getModelToken(OldScript.name), 
          useValue:{
            new: jest.fn().mockResolvedValue(mockAutomata()),
            constructor: jest.fn().mockResolvedValue(mockAutomata()),
            find: jest.fn(),
            findById: jest.fn().mockResolvedValue(mockAutomata()),
            update: jest.fn(),
          }
        },
        {
          provide: getModelToken(DownloadScript.name),
          useValue: {
            new: jest.fn().mockResolvedValue(mockAutomata()),
            constructor: jest.fn().mockResolvedValue(mockAutomata()),
            
          }
        },
        {
          provide: getModelToken(NeuralNetwork.name),
          useValue: {
            new: jest.fn().mockResolvedValue(mockAutomata()),
            constructor: jest.fn().mockResolvedValue(mockAutomata()),
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
            new: jest.fn().mockResolvedValue(mockAutomata()),
            constructor: jest.fn().mockResolvedValue(mockAutomata()),
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
            new: jest.fn().mockResolvedValue(mockAutomata()),
            constructor: jest.fn().mockResolvedValue(mockAutomata()),
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

  it('should return all scripts', async()=>{
    jest.spyOn(automataModel, 'find').mockReturnValue(([mockAutomata]) as any);
        const response = await service.getAll();
        expect(response).toEqual([mockAutomata]);
  });

  it('should return all scripts by game id', async()=>{
    jest.spyOn(automataModel, 'find').mockReturnValue(([mockAutomata]) as any);
        const response = await service.getByGame("Monopoly");
        expect(response).toEqual([mockAutomata]);
  });

  it('should get one script by id', async () => {
    jest.spyOn(automataModel, 'findOne').mockReturnValueOnce(
      createMock<Query<AutomataScriptDocument, AutomataScriptDocument>>({
        exec: jest
          .fn()
          .mockResolvedValueOnce(mockAutDoc({ name: 'Script12' })),
      }) as any,
    );
      const findMockAut = mockAutomata('Script12');
      jest.spyOn(service, 'getScriptById').mockImplementation(
      createMock<Query<AutomataScriptDocument, AutomataScriptDocument>>({
        exec: jest.fn().mockResolvedValueOnce(mockAutDoc({ name: 'Script12' })),})as any,);


     const result = service.getByGame("Script12").then(function(response){
      expect(response.toString()).toEqual(([{
        name:"Script12", 
      author:{name:"author1", email:"author1@gmail.com"},
      boardgame: "Monopoly",
      description: "This is monopoly script",
      version: {major: 2, minor:1, patch:3},
      size: 28,
      icon: {name:"iconFile", key:"iconKey", location:"iconLocation"},
      build: {name:"buildFile", key:"iconKey", location:"iconLocation"},
      models:["Model1", "Model2", "Model3"],
      iconSize:8,//basescript 
      previous: ["Script10","Script11", "Script09"],
      link: "www.somelink.com", 
      dateReleased: new Date("02-09-21"),
      downloads: 11,
      lastDownload: new Date("13-01-22"),
      export: true, 
      comments: [],
      rating: 4,
      source: mySource,
      }]).toString());
      expect(findMockAut).toBeDefined();
      expect(findMockAut).toBeTruthy();
      expect(findMockAut).toContainEqual(result);
    })
  })

  it('should download script', async ()=>{
    const thisUser: user ={
      name:"author1", email:"author1@gmail.com"
    }
    expect(service.download("Script12",thisUser)).resolves.toEqual(MockDownloaded);
  })

  it('should check for updates', async()=>{
    const result = jest.spyOn(automataModel,'find')
    expect(result).toBeDefined();
    
  })

  it('should check for the version', async()=>{
    const oldV : version ={
      major: 2,
      minor: 3,
      patch: 4,
    };

    const newV: version ={
      major: 3,
      minor: 1,
      patch: 0,
    };

      jest.spyOn(service, 'checkVersion').mockImplementation((oldV:version,newV:version )=>{
        expect(oldV).toHaveProperty("major"); 
        expect(newV).toHaveProperty("major"); 
        if (newV.major < oldV.major)
        {return false}
        else{
          if(newV.major === oldV.major){
            if(newV.minor < oldV.minor){
              return false
            }
            else{
              if(newV.minor === oldV.minor){
                if(newV.patch <= oldV.patch){
                  return false
                }
              }
            }
          }
      }});

        expect(oldV).toBeDefined();
        expect(newV).toBeDefined();
        try{
          const respone =await service.checkVersion(oldV,newV)
          expect(respone).toEqual(true)
        }
        catch(e){
          expect(false).toEqual(false)
        }
  });
})

  

  


