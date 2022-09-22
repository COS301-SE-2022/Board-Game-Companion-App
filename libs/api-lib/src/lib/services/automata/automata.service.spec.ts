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

/*************************************************unit test**********************************************/
describe('AutomataService', ()=>{
  let service: AutomataService; 
  
  let dbService : MongoDbStorageService;
  let automataModel:  Model<AutomataScriptDocument>;
  let oldModel : Model<OldScriptDocument>;
  

  const userAuth : user ={
    name:"author1", 
    email:"author1@gmail.com"
  }
  const mySource : file ={
    name: "sourceFile",
    key:"key6389",
    location: "thisLocation"
  }
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
    downloads : 11,
    lastDownload: new Date("13-01-22"),
    export: true, 
    comments: [],
    rating: 4,
    source: mySource,
  } 
  
  beforeEach(async ()=>{
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        AutomataService, ModelsService,MongoDbStorageService, 
        {
          provide: getModelToken(AutomataScript.name), 
          useValue:{
            new: jest.fn().mockResolvedValue(mockAutomata),
            constructor: jest.fn().mockResolvedValue(mockAutomata),
            find: jest.fn(),
            findOne: jest.fn(),
            findById: jest.fn(),
            findByIdAndRemove: jest.fn(),
          }
        },
        {
          provide:getModelToken(OldScript.name), 
          useValue:{
            new: jest.fn().mockResolvedValue(mockAutomata),
            constructor: jest.fn().mockResolvedValue(mockAutomata),
            find: jest.fn(),
            findById: jest.fn(),
            update: jest.fn(),
          }
        },
        {
          provide: getModelToken(DownloadScript.name),
          useValue: {
            new: jest.fn().mockResolvedValue(mockAutomata),
            constructor: jest.fn().mockResolvedValue(mockAutomata),
            
          }
        },
        {
          provide: getModelToken(NeuralNetwork.name),
          useValue: {
            new: jest.fn().mockResolvedValue(mockAutomata),
            constructor: jest.fn().mockResolvedValue(mockAutomata),
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
            new: jest.fn().mockResolvedValue(mockAutomata),
            constructor: jest.fn().mockResolvedValue(mockAutomata),
            find: jest.fn(),
            findOne: jest.fn(),
            findByIdAndRemove: jest.fn(),
            deleteOne: jest.fn(),
            update: jest.fn(),
            create: jest.fn(),
            remove: jest.fn(),
            exec: jest.fn(),
          }
        }
      ],
    }).compile();

     service= moduleRef.get<AutomataService>(AutomataService); 
     dbService= moduleRef.get<MongoDbStorageService>(MongoDbStorageService);
     automataModel=  moduleRef.get<Model<AutomataScriptDocument>>(getModelToken(AutomataScript.name));
     oldModel = moduleRef.get<Model<OldScriptDocument>>(getModelToken(OldScript.name));
     

  });
  it('should be defined', () => {
    expect(service).toBeDefined();
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
  
  
  it('should get script by One script ', async()=>{
    jest.spyOn(automataModel, 'findOne').mockReturnValueOnce((mockAutomata) as any);
    const response = await service.getAutomataScript("Script12",userAuth);
    expect(response).toEqual(mockAutomata)
  });

 it('remove script from storage', async()=>{
  const deleted = await dbService.remove("key6389"); //assigned as false 
  expect(deleted).toBeFalsy();
  expect(await dbService.remove("key6389")).not.toHaveReturned;
 });

})