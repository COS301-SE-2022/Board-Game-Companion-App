//import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from "@nestjs/testing"
import { user } from '../../models/general/user';
import { CollectionsService } from '../../services/collection/collections.service';
import { CollectionsController } from "../board-collection/collections.controller"

jest.mock('../../services/collection/collections.service');

/***************************************************Unit Test***********************************************/
describe('CollectionsController',()=>{
  let service : CollectionsService; 
  let controller: CollectionsController;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [CollectionsController], 
      providers: [
        {
          provide: CollectionsService, 
          useValue: {
            create: jest.fn().mockImplementation((name:string,owner:user)=>
              Promise.resolve({
                owner: owner,
                name: name,
                boardgames: ["30 seconds" ,"roots", "monopoly"]
              })),
            alreadyExist: jest.fn().mockImplementation((owner:user,name:string)=>
              Promise.resolve(true)),
            getCollectionsByUser: jest.fn().mockImplementation((owner: user)=>
              Promise.resolve({
                owner: owner,
                name: "Collection1",
                boardgames: ["chess" ,"roots", "snakes and ladders"]
              })
            ),
            getAllCollections: jest.fn().mockResolvedValue([
              {owner: {name:"James", email:"jamesbond007@gmail.com"}, name: "Collection1", boardgames: ["chess" , "snakes and ladders"]},
              {owner: {name:"micheal", email:"michealsmith@gmail.com"}, name: "Collection2", boardgames: ["checkers" ,"roots", "monopoly"]},
              {owner: {name:"jennifer", email:"jenniferlopez@gmail.com"}, name: "Collection3", boardgames: ["boardgame1", "boardgame2", "boardgame4"]},
            ]),
            addBoardGame: jest.fn().mockImplementation((boardgame:string,name:string,owner:user)=>Promise.resolve(true)),
            removeBoardGame: jest.fn().mockImplementation((boardgame:string,name:string,owner:user)=>Promise.resolve(2)),
            removeCollectionById: jest.fn().mockImplementation((id:string)=>Promise.resolve(2)),
            removeCollection: jest.fn().mockImplementation((owner:user,name:string)=> Promise.resolve(2)),
            getScripts: jest.fn().mockImplementation((id:string)=>Promise.resolve({
              name: id,
              author: {name:"Mark", email:"MarkDavids@gmail.com"},
              boardgame: "Chess",
              description: "This is a roots board game", 
              version: {major:2, minor:8, patch:8},
              size: 32, 
              icon:{name:"thisIcon3",key:"icon80",location:"Iconlocation3"},
              build:{name:"thisBuild",key:"key134",location:"thislocation3"},
              models:["thisisaModel3", "thisisanothermodel3"],
              iconSize:10, //basescript
              previous: ["Script1.2.5"],
              link:"www.thisisalink2.com",
              dateReleased: new Date("18-02-16"), 
              downloads: 8, 
              lastDownload: new Date("20-05-22"),
              export: true,
              comments: [],
              source: {name:"fileName3", key:"key313", location:"filelocation3"}
            }))
          }
        }
      ]
    }).compile();

    controller = moduleRef.get<CollectionsController>(CollectionsController);
    service =  moduleRef.get<CollectionsService>(CollectionsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getCollectionsForUser', ()=>{
    it('should get a collection for specific User', ()=>{
      expect(controller.getCollectionsForUser("owner's Name", "owner's email")).resolves.toEqual({
        owner: {name:"owner's Name", email:"owner's email"},
        name: "Collection1",
        boardgames: ["chess" ,"roots", "snakes and ladders"]
      });
    });
  });

  describe('createCollection', ()=>{
    it('should create a collection', ()=>{
      const newUser: user ={
        name: "newUser",
        email: "newUser@gmail.com"
      };
        expect(controller.createCollection("Collection3", newUser)).resolves.toEqual({
          owner: newUser,
          name: "Collection3",
          boardgames: ["30 seconds" ,"roots", "monopoly"]  
        });
    });
  });

  describe('removeCollection', ()=>{
    it ('should remove a collection', ()=>{
      expect(controller.removeCollection("FaveCollection","James","JamesJennifer@gmail.com")).resolves.toEqual(2)
    });
  });

  describe('removeBoardGame', ()=>{
    it('should remove a board game', ()=>{
      const newUser: user ={
        name: "Jennifer",
        email: "jenniferaustin@gmail.com"
      };
      expect(controller.removeBoardGame("30 seconds","Collection4",newUser.name,newUser.email)).resolves.toEqual(2)
    });
  });

  describe('removeCollectionById', ()=>{
    it('should remove a collection by its id', ()=>{
      expect(controller.removeCollectionById("string ID")).resolves.toEqual(2)
    });
  });

  describe('addGameToCollection', ()=>{
    it('should add a board game to a collection', ()=>{
      const newUser: user ={
        name: "Jennifer",
        email: "jenniferaustin@gmail.com"
      }
      expect(controller.addGameToCollection(newUser,"ChessCollection","Chess")).resolves.toEqual(true)
    });
  }); 

  describe('getScripts', ()=>{
    it('should get all scripts', ()=>{
      expect(controller.getScripts("ScriptId")).resolves.toEqual({
        name: "ScriptId",
        author: {name:"Mark", email:"MarkDavids@gmail.com"},
        boardgame: "Chess",
        description: "This is a roots board game", 
        version: {major:2, minor:8, patch:8},
        size: 32, 
        icon:{name:"thisIcon3",key:"icon80",location:"Iconlocation3"},
        build:{name:"thisBuild",key:"key134",location:"thislocation3"},
        models:["thisisaModel3", "thisisanothermodel3"],
        iconSize:10, //basescript
        previous: ["Script1.2.5"],
        link:"www.thisisalink2.com",
        dateReleased: new Date("18-02-16"), 
        downloads: 8, 
        lastDownload: new Date("20-05-22"),
        export: true,
        comments: [],
        source: {name:"fileName3", key:"key313", location:"filelocation3"}
      })
    });
  });

  describe('alreadyExists', ()=>{
    it('should check if there is already a collection', ()=>{
      const newUser: user ={
        name: "Jennifer",
        email: "jenniferaustin@gmail.com"
      };
      expect(controller.alreadyExists(newUser.name, newUser.email,"Collection20")).resolves.toEqual(true)
    });
  });
})