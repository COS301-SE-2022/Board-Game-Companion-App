import { Test, TestingModule } from "@nestjs/testing"
import { user } from '../../models/general/user';
import { CompilerService } from '../../services/compiler/compiler.service';
import { MyScriptService } from '../../services/my-script/my-script.service';
import { ApiMyScriptController } from '../../controllers/my-scripts/my-script.controller';
import { FileInterceptor } from '@nestjs/platform-express';
import { status as stat} from '../../models/general/status';
import { emptyEntity } from "../../models/general/entity";


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

  describe('getAllMyScript', ()=>{
    it('should get all my scripts', ()=>{
      expect(controller.getAllMyScript("user","user@gmail.com")).resolves.toEqual({
        name:"Script12", 
        author:{name:"user", email:"user@gmail.com"},
        boardgame: "Monopoly",
        description: "This is monopoly script",
        version: {major: 2, minor:1, patch:3},
        size: 28,
        icon: {name:"iconFile", key:"iconKey", location:"iconLocation"},
        build: {name:"buildFile", key:"iconKey", location:"iconLocation"},
        models:["Model1", "Model2", "Model3"],
        iconSize: 8,//basescript 
        created : new Date ("01-01-20"),
        lastUpdated: new Date ("01-01-20"),
        status: {value:0, message:""},
        export: true, 
        programStructure: {type: emptyEntity},
        source: {name:"sourceFile", key:"sourceKey", location:"sourceLocation"},
      });
    });
  });

  describe('checkName', ()=>{
    it('should check name of user', ()=>{
      expect(controller.checkName("script3","user2@gmail.com", "user2")).resolves.toEqual(true);
    });
  });

  describe('release', ()=>{
    it ('should release a script', ()=>{
      expect(controller.release("id",2,3,4,)).resolves.toEqual(true);
    });
  });

  // describe('removeBoardGame', ()=>{
  //   it('should remove a board game', ()=>{
  //     const newUser: user ={
  //       name: "Jennifer",
  //       email: "jenniferaustin@gmail.com"
  //     };
  //     expect(controller.removeBoardGame("30 seconds","Collection4",newUser.name,newUser.email)).resolves.toEqual(2)
  //   });
  // });

  describe('removeMyScript', ()=>{
    it('should remove a collection by its id', ()=>{
      expect(controller.removeMyScript("string ID")).resolves.toEqual(2)
    });
  });

  // describe('addGameToCollection', ()=>{
  //   it('should add a board game to a collection', ()=>{
  //     const newUser: user ={
  //       name: "Jennifer",
  //       email: "jenniferaustin@gmail.com"
  //     }
  //     expect(controller.addGameToCollection(newUser,"ChessCollection","Chess")).resolves.toEqual(true)
  //   });
  // }); 

  // describe('getScripts', ()=>{
  //   it('should get all scripts', ()=>{
  //     controller.getScripts("ScriptId").then(function(response){
  //       expect(response.toString()).toEqual(([{
  //       name: "ScriptId",
  //       author: {name:"Mark", email:"MarkDavids@gmail.com"},
  //       boardgame: "Chess",
  //       description: "This is a roots board game", 
  //       version: {major:2, minor:8, patch:8},
  //       size: 32, 
  //       icon:{name:"thisIcon3",key:"icon80",location:"Iconlocation3"},
  //       build:{name:"thisBuild",key:"key134",location:"thislocation3"},
  //       models:["thisisaModel3", "thisisanothermodel3"],
  //       iconSize:10, //basescript
  //       previous: ["Script1.2.5"],
  //       link:"www.thisisalink2.com",
  //       dateReleased: new Date("18-02-16"), 
  //       downloads: 8, 
  //       lastDownload: new Date("20-05-22"),
  //       export: true,
  //       comments: [],
  //       source: {name:"fileName3", key:"key313", location:"filelocation3"}
  //       }]).toString())
  //     })
  //   });
  // });

  // describe('alreadyExists', ()=>{
  //   it('should check if there is already a collection', ()=>{
  //     const newUser: user ={
  //       name: "Jennifer",
  //       email: "jenniferaustin@gmail.com"
  //     };
  //     expect(controller.alreadyExists(newUser.name, newUser.email,"Collection20")).resolves.toEqual(true)
  //   });
  // });
})
