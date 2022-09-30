import { EditorService } from './editor.service';
import { MyScript, MyScriptDocument } from '../../schemas/my-script.schema';
import { Model} from 'mongoose';
import { NeuralNetwork, NeuralNetworkDocument } from '../../schemas/neural-network.schema';
import { CompilerService } from '../compiler/compiler.service';
import { MongoDbStorageService } from '../mongodb-storage/mongodb-storage.service';
import { HttpService } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { status as stat} from '../../models/general/status';
import { file } from '../../models/general/files';
import { entity } from '../../models/general/entity';
import { File} from '../../schemas/file.schema';
import { Script } from 'vm';
import { transpilationResponse } from '../../models/general/transpilationResponse';

/*************************************************unit test**********************************************/
const expectedUrl = "http://localhost:3333/api/";
//this.api = "https://board-game-companion-app-api.herokuapp.com/api/"
describe('EditorService',()=>{
  let service: EditorService;
  let myScriptModel : Model<MyScriptDocument>;
  let networksModel : Model<NeuralNetworkDocument>;
  let compilerService: CompilerService;
  let  httpService: HttpService;
  let storageService:MongoDbStorageService;
 
  const mystat : stat = {
    value: 0, 
    message: "some message",
  }; 

  const myentity: entity ={
    type: "typee",
    name: "name",
    startLine: 1,
    endLine: 7,
    startPosition: 10,
    endPosition: 18,
    properties: [],
    children: []
  };

  const myFile : file ={
    name: "filename",
    key: "filekey",
    location: "filelocation",
  };

  const thisEntity : entity ={
    type: "string",
    name: "script12",
    startLine: 3,
    endLine: 12,
    startPosition: 12,
    endPosition: 19,
    properties: [],
    children: [],
  }

  const myTranspilation : transpilationResponse={
    status: "up",
    message: "this script is up",
    errors: [],
    structure: thisEntity,
  }
  const mockmyScritDoc = (mock?: Partial<MyScript>): Partial<MyScriptDocument> => ({
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
    created: mock?.created || new Date("11-02-19"),
    lastUpdate: mock?.lastUpdate || new Date("09-02-19"),
    status: mock?.status|| mystat,
    export: mock?.export || true,
    programStructure: mock?.programStructure || myentity,
    source: mock?.source || myFile,
  });

  const mockScript : MyScript ={
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
    created: new Date("11-02-19"),
    lastUpdate: new Date("09-02-19"),
    status:mystat,
    export: true,
    programStructure:myentity,
    source: myFile,
  };
  

  beforeEach(async ()=>{
    const module: TestingModule = await Test.createTestingModule({
      providers:[EditorService,CompilerService, MongoDbStorageService,
      {
        provide: HttpService,
        useValue: {
          get: jest.fn(),
          post: jest.fn(),
          patch: jest.fn(),
          put: jest.fn(),
          delete: jest.fn(),
        }, 
      },
      {
        provide: getModelToken(MyScript.name),
        useValue:{
          findbyId: jest.fn(async ()=>{
            return mockmyScritDoc
          }),
        }
      },

    {
      provide: getModelToken(File.name),
      useValue:{
        //constructor: jest.fn(dto),
        findById: jest.fn(),

      }
    }, 
    {
    provide: getModelToken(Script.name),
      useValue:{
        //constructor: jest.fn(dto),
        findById: jest.fn(),

      }
    },
    {
      provide: getModelToken(NeuralNetwork.name),
      useValue: {
        find: jest.fn(),
      }
    }],
    }).compile();

    service= module.get<EditorService>(EditorService);
    myScriptModel = module.get<Model<MyScriptDocument>>(getModelToken(MyScript.name));
    networksModel = module.get<Model<NeuralNetworkDocument>>(getModelToken(NeuralNetwork.name));
    compilerService= module.get<CompilerService>(CompilerService);
    httpService= module.get<HttpService>(HttpService);
    storageService= module.get<MongoDbStorageService>(MongoDbStorageService);
   
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(myScriptModel).toBeDefined();
    expect(networksModel).toBeDefined();
    expect(compilerService).toBeDefined();
    expect(storageService).toBeDefined();
  });

  // describe('updateBuild', ()=>{
  //   it('should update the script build', async()=>{
  //     const result = await service.updateBuild("some ID", "compiled code");
  //     // try{

  //     // }catch(e){
  //     //   status = false 
  //     // } 
  //     expect(result).toEqual(mockmyScritDoc);
  //   });
  // });

  // describe('updateModels', ()=>{
  //   it('should update models', async()=>{
  //     return service.updateModels("script12", ["myNetwork"]).then(data=>{
  //       expect(data.toString()).toBe(mockScript.toString());
  //     });
  //   });
  // });

  // describe('updateFile', ()=>{
  //   it('should update script file', async()=>{
  //     expect(service.updateFile("some ID", "script content")).resolves.toEqual(myTranspilation);
  //   });
  // });


});