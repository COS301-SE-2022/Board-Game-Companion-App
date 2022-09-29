import { Test, TestingModule } from "@nestjs/testing"
import { user } from '../../models/general/user';
import { CompilerService } from '../../services/compiler/compiler.service';
import { MyScriptService } from '../../services/my-script/my-script.service';
import { ApiMyScriptController } from '../../controllers/my-scripts/my-script.controller';
import { FileInterceptor } from '@nestjs/platform-express';
import { status as stat} from '../../models/general/status';
import { emptyEntity } from "../../models/general/entity";
import { UploadedFile, UseInterceptors } from "@nestjs/common";
import { any } from "@tensorflow/tfjs";


jest.mock('../../services/compiler/compiler.service');
jest.mock('../../services/my-script/my-script.service')

/***************************************************Unit Test***********************************************/
describe('ApiMyScriptController',()=>{
  let compiler : CompilerService; 
  let script: MyScriptService;
  let controller: ApiMyScriptController;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [ApiMyScriptController], 
      providers: [ 
        {provide: CompilerService, useValue: {}},
        {provide: MyScriptService, useValue: {}}
      ]
    }).compile();

    controller = moduleRef.get<ApiMyScriptController>(ApiMyScriptController);
    script = moduleRef.get<MyScriptService>(MyScriptService);
    compiler =  moduleRef.get<CompilerService>(CompilerService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // describe('getAllMyScript', ()=>{
  //   it('should get all my scripts', ()=>{
  //     return controller.getAllMyScript("user","user@gmail.com").then(data=>{
  //     expect(data.toString()).toBe(({
  //       name:"Script12", 
  //       author:{name:"user", email:"user@gmail.com"},
  //       boardgame: "Monopoly",
  //       description: "This is monopoly script",
  //       version: {major: 2, minor:1, patch:3},
  //       size: 28,
  //       icon: {name:"iconFile", key:"iconKey", location:"iconLocation"},
  //       build: {name:"buildFile", key:"iconKey", location:"iconLocation"},
  //       models:["Model1", "Model2", "Model3"],
  //       iconSize: 8,//basescript 
  //       created : new Date ("01-01-20"),
  //       lastUpdated: new Date ("01-01-20"),
  //       status: {value:0, message:""},
  //       export: true, 
  //       programStructure: {type: emptyEntity},
  //       source: {name:"sourceFile", key:"sourceKey", location:"sourceLocation"},
  //     }).toString());
  //   });
  //   });
  // });

  // describe('checkName', ()=>{
  //   it('should check name of user', ()=>{
  //     expect(controller.checkName("script3","user2@gmail.com", "user2")).resolves.toEqual(true);
  //   });
  // });

  // describe('release', ()=>{
  //   it ('should release a script', ()=>{
  //     expect(controller.release("id",2,3,4,)).resolves.toEqual(true);
  //   });
  // }); 

  // describe('removeMyScript', ()=>{
  //   it('should remove a collection by its id', ()=>{
  //     expect(controller.removeMyScript("string ID")).resolves.toEqual(2)
  //   });
  // });

//  describe('update', ()=>{
//   it('should get all the users scripts', ()=>{
//     expect(controller.update("string ID",true,"some description")).resolves.toEqual({
//       name:"Script12", 
//       author:{name:"user", email:"user@gmail.com"},
//       boardgame: "Monopoly",
//       description: "This is monopoly script",
//       version: {major: 2, minor:1, patch:3},
//       size: 28,
//       icon: {name:"iconFile", key:"iconKey", location:"iconLocation"},
//       build: {name:"buildFile", key:"iconKey", location:"iconLocation"},
//       models:["Model1", "Model2", "Model3"],
//       iconSize: 8,//basescript 
//       created : new Date ("01-01-20"),
//       lastUpdated: new Date ("01-01-20"),
//       status: {value:0, message:""},
//       export: true, 
//       programStructure: {type: emptyEntity},
//       source: {name:"sourceFile", key:"sourceKey", location:"sourceLocation"},
//     });
//   });
//  });


//  describe('#icon',()=>{
//   it('should create a script', async ()=>{
    
//     expect(controller.createScript("user1", "user1@gmail.com", "Script24", "Monopoly", "somee Description",any)).resolves.toEqual({
//       name:"Script12", 
//       author:{name:"author1", email:"author1@gmail.com"},
//       boardgame: "Monopoly",
//       description: "This is monopoly script",
//       version: {major: 2, minor:1, patch:3},
//       size: 28,
//       icon: {name:"iconFile", key:"iconKey", location:"iconLocation"},
//       build: {name:"buildFile", key:"iconKey", location:"iconLocation"},
//       models:["Model1", "Model2", "Model3"],
//       iconSize: 8,//basescript 
//     });
//   });
//  });

//  describe('RetrieveAllScripts', ()=>{
//   it('should get all scripts', ()=>{
//   expect(controller.RetrieveAllScripts()).resolves.toEqual([{
//       name:"Script12", 
//       author:{name:"user", email:"user@gmail.com"},
//       boardgame: "Monopoly",
//       description: "This is monopoly script",
//       version: {major: 2, minor:1, patch:3},
//       size: 28,
//       icon: {name:"iconFile", key:"iconKey", location:"iconLocation"},
//       build: {name:"buildFile", key:"iconKey", location:"iconLocation"},
//       models:["Model1", "Model2", "Model3"],
//       iconSize: 8,//basescript 
//       created : new Date ("01-01-20"),
//       lastUpdated: new Date ("01-01-20"),
//       status: {value:0, message:""},
//       export: true, 
//       programStructure: {type: emptyEntity},
//       source: {name:"sourceFile", key:"sourceKey", location:"sourceLocation"},
//   }]);
//   });
//  });
})
