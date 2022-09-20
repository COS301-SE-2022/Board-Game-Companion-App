import { Test, TestingModule } from '@nestjs/testing';
import { emptyEntity, entity } from '../../models/general/entity';
import { ApiEditorController } from './editor.controller';
import { EditorService } from '../../services/editor/editor.service';

jest.mock('../../services/editor/editor.service');
/***************************************************Unit Test***********************************************/

describe('ApiEditorController',()=>{
  let service : EditorService; 
  let controller: ApiEditorController;

  beforeEach(async ()=> {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [ApiEditorController], 
      providers: [{
        provide: EditorService, 
        useValue: {
          updateModels: jest.fn().mockImplementation((script:string, networks:string[])=>
            Promise.resolve({
              name:script, 
              author:{name:"author1", email:"author1@gmail.com"},
              boardgame: "Monopoly",
              description: "This is monopoly script",
              version: {major: 2, minor:1, patch:3},
              size: 28,
              icon: {name:"iconFile", key:"iconKey", location:"iconLocation"},
              build: {name:"buildFile", key:"iconKey", location:"iconLocation"},
              models:networks,
              iconSize: 8,//basescript 
              created: new Date("12-06-20"),
              lastUpdate: new Date("23-05-18"),
              status: {value: 2, message:"Working"}, 
              export: true, 
              programStructure: {ent : emptyEntity},
              source: {name:"thissource", key:"thisKey", location:"thisLocation"}
            })
          ),
          updateFile: jest.fn().mockImplementation((id:string,content:string)=>
            Promise.resolve({
              name:id, 
              content:content
            })
          )
        }
      }]
    }).compile()

    controller = moduleRef.get<ApiEditorController>(ApiEditorController);
    service = moduleRef.get<EditorService>(EditorService)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('updateModels', ()=>{
    it('should update the models', ()=>{
      expect(controller.updateModels("MyScript", ["Model1", "Model2", "Model3"])).resolves.toEqual({
        name: "MyScript",
        author: { name: 'author1', email: 'author1@gmail.com' },
        boardgame: 'Monopoly',
        description: 'This is monopoly script',
        version: { major: 2, minor: 1, patch: 3 },
        size: 28,
        icon: { name: 'iconFile', key: 'iconKey', location: 'iconLocation' },
        build: { name: 'buildFile', key: 'iconKey', location: 'iconLocation' },
        models: ["Model1", "Model2", "Model3"],
        iconSize: 8, //basescript
        created: new Date('12-06-20'),
        lastUpdate: new Date('23-05-18'),
        status: { value: 2, message: 'Working' },
        export: true,
        programStructure: { ent: emptyEntity },
        source: {
          name: 'thissource',
          key: 'thisKey',
          location: 'thisLocation',
        },
      });
    });
  });

  describe('updateFile', ()=>{
    it('should update the file', ()=>{
      expect(controller.updateFile("stringID", "This is file content")).resolves.toEqual({
        name:"stringID",
        content:"This is file content"
      })
    });
  });
  

})