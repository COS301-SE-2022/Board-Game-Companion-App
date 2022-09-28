import { Test, TestingModule } from "@nestjs/testing";
//import { createMock } from '@golevelup/ts-jest';
import { AutomataService } from "../../services/automata/automata.service";
import { RatingService } from "../../services/ratings/rating.service";
import { ApiAutomataScriptController } from "../automata-scripts/automata-script.controller";
import { ModelsService } from "../../services/models/models.service";
import { MongoDbStorageService } from "../../services/mongodb-storage/mongodb-storage.service";
import { AutomataScript, AutomataScriptDocument } from "../../schemas/automata-script.schema";
import { OldScript, OldScriptDocument } from  "../../schemas/old-script.schema";
import { DownloadScript, DownloadScriptDocument } from "../../schemas/download-script.schema";
import mongoose, { Model, Connection, connect } from "mongoose";

import { user } from "../../models/general/user";
import { version } from "../../models/general/version";


jest.mock('../../services/automata/automata.service');
/***************************************************Unit Test***********************************************/
describe('AutomataScriptController',()=>{
  let automataService : AutomataService; 
  let apiAutomataScriptController: ApiAutomataScriptController;
  let ratingService : RatingService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      //imports: [ApiLibModule],
      controllers: [ApiAutomataScriptController],
      providers: [
        //RatingService 
        {provide:RatingService,useValue:{
        rate: jest.fn().mockImplementation((user:user,script:string,value:number) =>
        Promise.resolve({
          user: user,
          script: script,
          value: value
        })),
        getRating: jest.fn().mockImplementation((user:user,script:string) =>
        Promise.resolve({
          user: user,
          script: script,
          value: 2
        })),
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        average: jest.fn().mockImplementation((script:string) => Promise.resolve(50)),
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        countRating: jest.fn().mockImplementation((script:string) => Promise.resolve(18))
      }},
      //AutomataService
      { provide:AutomataService,useValue:{
        getAll: jest.fn().mockResolvedValue([
        {
          name: "Script1",
          author: {name:"Jack", email:"jackdaniels@gmail.com"},
          boardgame: "TicTacToe",
          description: "This is a tictactoe board game", 
          version: {major:8, minor:8, patch:8},
          size: 32, 
          icon:{name:"thisIcon",key:"icon567",location:"Iconlocation"},
          build:{name:"thisBuild",key:"key1234",location:"thislocation"},
          models:["thisisaModel", "thisisanothermodel"],
          iconSize:10, //base script 
          previous: ["Script1.0"],
          link:"www.thisisalink.com",
          dateReleased: new Date("18-06-17"), 
          downloads: 3, 
          lastDownload: new Date("17-07-22"),
          export: true,
          comments: [],
          source: {name:"fileName", key:"key555", location:"filelokcation"}
        },
        {
          name: "Script2",
          author: {name:"David", email:"Davidjones@gmail.com"},
          boardgame: "monopoly",
          description: "This is a monopoly board game", 
          version: {major:8, minor:8, patch:8},
          size: 32, 
          icon:{name:"thisIcon2",key:"icon890",location:"Iconlocation2"},
          build:{name:"thisBuild",key:"key1234",location:"thislocation2"},
          models:["thisisaModel2", "thisisanothermodel2"],
          iconSize:10, //base script 
          previous: ["Script1.1.0"],
          link:"www.thisisalink2.com",
          dateReleased: new Date("24-03-17"), 
          downloads: 3, 
          lastDownload: new Date("25-07-22"),
          export: true,
          comments: [],
          source: {name:"fileName2", key:"key333", location:"filelocation2"}
        }
      ]),
      getByGame: jest.fn().mockImplementation((id: string) =>
      Promise.resolve([{
          name: "Peter",
          author: {name:"Mark", email:"MarkDavids@gmail.com"},
          boardgame: id,
          description: "This is a roots board game", 
          version: {major:2, minor:8, patch:8},
          size: 32, 
          icon:{name:"thisIcon3",key:"icon80",location:"Iconlocation3"},
          build:{name:"thisBuild",key:"key134",location:"thislocation3"},
          models:["thisisaModel3", "thisisanothermodel3"],
          iconSize:10, //base script 
          previous: ["Script1.2.5"],
          link:"www.thisisalink2.com",
          dateReleased: new Date("18-02-16"), 
          downloads: 8, 
          lastDownload: new Date("20-05-22"),
          export: true,
          comments: [],
          source: {name:"fileName3", key:"key313", location:"filelocation3"}
      }])),
      download: jest.fn().mockImplementation((id:string,owner:user) =>
      Promise.resolve({
        name: "Samuel",
        author: {name:"David", email:"Davidjones@gmail.com"},
        boardgame: id,
        description: "This is a monopoly board game", 
        version: {major:8, minor:8, patch:8},
        size: 32, 
        icon:{name:"thisIcon2",key:"icon890",location:"Iconlocation2"},
        build:{name:"thisBuild",key:"key1234",location:"thislocation2"},
        models:["thisisaModel2", "thisisanothermodel2"],
        iconSize:10,// base script 
        owner: owner,
        link: "www.thisnewlinkexample.com",
        dateDownloaded: new Date("11-02-16")
      })),
      getOldVersions: jest.fn().mockImplementation((idList:string[])=>
      Promise.resolve([{
          name: "Jake",
          author: {name:"David", email:"Davidjones@gmail.com"},
          boardgame: "monopoly",
          description: "This is a monopoly board game", 
          version: {major:8, minor:8, patch:8},
          size: 32, 
          icon:{name:"thisIcon2",key:"icon890",location:"Iconlocation2"},
          build:{name:"thisBuild",key:"key1234",location:"thislocation2"},
          models: idList,
          iconSize:10, //baseScript
          dateReleased: new Date("11-02-16"),
          downloads: 5,
          lastDownload: new Date("10-09-21"),
          export: false,
          comments: [],
          source: {name:"Source3", key:"key2323", location:"location254"}
        }])),
      getAutomataScript: jest.fn().mockImplementation((name:string,author:user)=>
      Promise.resolve({
        name: name,
        author: author,
        boardgame: "monopoly",
        description: "This is a monopoly board game", 
        version: {major:8, minor:8, patch:8},
        size: 32, 
        icon:{name:"thisIcon2",key:"icon890",location:"Iconlocation2"},
        build:{name:"thisBuild",key:"key1234",location:"thislocation2"},
        models:["thisisaModel2", "thisisanothermodel2"],
        iconSize:10, //baseScript
        previous: ["Previous1", "Previous2"],
        link: "www.Games.com",
        dateReleased: new Date("08-05-18"),
        downloads: 12,
        lastDownload: new Date("09-10-20"),
        export: true,
        comments: [],
        source: {name:"source5", key:"Key555", location:"sourceLocation5"}
      })), 
      addComment: jest.fn().mockImplementation((scriptId:string,commentId:string) =>
      Promise.resolve({
          name: scriptId,
          author: {name:"David", email:"Davidjones@gmail.com"},
          boardgame: "monopoly",
          description: "This is a monopoly board game", 
          version: {major:8, minor:8, patch:8},
          size: 32, 
          icon:{name:"thisIcon2",key:"icon890",location:"Iconlocation2"},
          build:{name:"thisBuild",key:"key1234",location:"thislocation2"},
          models:["thisisaModel2", "thisisanothermodel2"],
          iconSize:10, //baseScript
          dateReleased: new Date("11-02-16"),
          downloads: 5,
          lastDownload: new Date("10-09-21"),
          export: false,
          comments: [{type: commentId, ref:"David"}],
          source: {name:"Source3", key:"key2323", location:"location254"}
      })),
      getScriptById: jest.fn().mockImplementation((id:string) => 
      Promise.resolve({
        name: id,
        author: {name:"David", email:"Davidjones@gmail.com"},
        boardgame: "monopoly",
        description: "This is a monopoly board game", 
        version: {major:8, minor:8, patch:8},
        size: 32, 
        icon:{name:"thisIcon2",key:"icon890",location:"Iconlocation2"},
        build:{name:"thisBuild",key:"key1234",location:"thislocation2"},
        models:["thisisaModel2", "thisisanothermodel2"],
        iconSize:10, //baseScript
        dateReleased: new Date("11-02-16"),
        downloads: 5,
        lastDownload: new Date("10-09-21"),
        export: false,
        comments: [],
        source: {name:"Source3", key:"key2323", location:"location254"}
      })),
      
      checkVersion: jest.fn().mockReturnValue({result:true}),
      checkForUpdatesForOne: jest.fn().mockImplementation((id:string) =>
        Promise.resolve("This "+id+" is found!")
      )
      }}]
    }).compile();

    automataService = moduleRef.get<AutomataService>(AutomataService);
    ratingService = moduleRef.get<RatingService>(RatingService);
    apiAutomataScriptController = moduleRef.get<ApiAutomataScriptController>(ApiAutomataScriptController);
  
  });

  it('should be defined', ()=>{
    expect(apiAutomataScriptController).toBeDefined();
  });

  describe('download', () => {
   it ('should download the script', () =>{
    const newUser: user ={
      name: "newUser",
      email: "newUser@gmail.com"
    };
    expect(apiAutomataScriptController.download("a string id",newUser.name,newUser.email)).resolves.toEqual({
        name: "Samuel",
        author: {name:"David", email:"Davidjones@gmail.com"},
        boardgame: "a string id",
        description: "This is a monopoly board game", 
        version: {major:8, minor:8, patch:8},
        size: 32, 
        icon:{name:"thisIcon2",key:"icon890",location:"Iconlocation2"},
        build:{name:"thisBuild",key:"key1234",location:"thislocation2"},
        models:["thisisaModel2", "thisisanothermodel2"],
        iconSize:10,// base script 
        owner: {name:newUser.name, email:newUser.email},
        link: "www.thisnewlinkexample.com",
        dateDownloaded: new Date("11-02-16")
      })
    })

  });

  describe('getOldVersions', () => {
    it ('should get older versions of the script', () =>{
    
     expect(apiAutomataScriptController.getOldVersions("a string of idLists")).resolves.toEqual({
      name: "Jake",
      author: {name:"David", email:"Davidjones@gmail.com"},
      boardgame: "monopoly",
      description: "This is a monopoly board game", 
      version: {major:8, minor:8, patch:8},
      size: 32, 
      icon:{name:"thisIcon2",key:"icon890",location:"Iconlocation2"},
      build:{name:"thisBuild",key:"key1234",location:"thislocation2"},
      models: "a string of idLists",
      iconSize:10, //baseScript
      dateReleased: new Date("11-02-16"),
      downloads: 5,
      lastDownload: new Date("10-09-21"),
      export: false,
      comments: [],
      source: {name:"Source3", key:"key2323", location:"location254"}
       })
     })
 
   });

   describe('getAll', () => {
    it ('should return all scripts', () =>{
    
     expect(apiAutomataScriptController.getAll()).resolves.toEqual([
      {
        name: "Script1",
        author: {name:"Jack", email:"jackdaniels@gmail.com"},
        boardgame: "TicTacToe",
        description: "This is a tictactoe board game", 
        version: {major:8, minor:8, patch:8},
        size: 32, 
        icon:{name:"thisIcon",key:"icon567",location:"Iconlocation"},
        build:{name:"thisBuild",key:"key1234",location:"thislocation"},
        models:["thisisaModel", "thisisanothermodel"],
        iconSize:10, //base script 
        previous: ["Script1.0"],
        link:"www.thisisalink.com",
        dateReleased: new Date("18-06-17"), 
        downloads: 3, 
        lastDownload: new Date("17-07-22"),
        export: true,
        comments: [],
        source: {name:"fileName", key:"key555", location:"filelokcation"}
      },
      {
        name: "Script2",
        author: {name:"David", email:"Davidjones@gmail.com"},
        boardgame: "monopoly",
        description: "This is a monopoly board game", 
        version: {major:8, minor:8, patch:8},
        size: 32, 
        icon:{name:"thisIcon2",key:"icon890",location:"Iconlocation2"},
        build:{name:"thisBuild",key:"key1234",location:"thislocation2"},
        models:["thisisaModel2", "thisisanothermodel2"],
        iconSize:10, //base script 
        previous: ["Script1.1.0"],
        link:"www.thisisalink2.com",
        dateReleased: new Date("24-03-17"), 
        downloads: 3, 
        lastDownload: new Date("25-07-22"),
        export: true,
        comments: [],
        source: {name:"fileName2", key:"key333", location:"filelocation2"}
      }
    ])
     })
 
   });

   describe('getById', () => {
    it ('should return a script with the provided id', () =>{
    
     expect(apiAutomataScriptController.getById("some string id")).resolves.toEqual([
      {
        name: "some string id",
        author: {name:"David", email:"Davidjones@gmail.com"},
        boardgame: "monopoly",
        description: "This is a monopoly board game", 
        version: {major:8, minor:8, patch:8},
        size: 32, 
        icon:{name:"thisIcon2",key:"icon890",location:"Iconlocation2"},
        build:{name:"thisBuild",key:"key1234",location:"thislocation2"},
        models:["thisisaModel2", "thisisanothermodel2"],
        iconSize:10, //baseScript
        dateReleased: new Date("11-02-16"),
        downloads: 5,
        lastDownload: new Date("10-09-21"),
        export: false,
        comments: [],
        source: {name:"Source3", key:"key2323", location:"location254"}
      }
    ])
     })
 
   });

   describe('addComment', () => {
    it ('should return a script with the provided id', () =>{
    
     expect(apiAutomataScriptController.addComment("some script id", "some comment id")).resolves.toEqual(
      {
        name: "some script id",
        author: {name:"David", email:"Davidjones@gmail.com"},
        boardgame: "monopoly",
        description: "This is a monopoly board game", 
        version: {major:8, minor:8, patch:8},
        size: 32, 
        icon:{name:"thisIcon2",key:"icon890",location:"Iconlocation2"},
        build:{name:"thisBuild",key:"key1234",location:"thislocation2"},
        models:["thisisaModel2", "thisisanothermodel2"],
        iconSize:10, //baseScript
        dateReleased: new Date("11-02-16"),
        downloads: 5,
        lastDownload: new Date("10-09-21"),
        export: false,
        comments: [{type:"some comment id", ref:"David"}],
        source: {name:"Source3", key:"key2323", location:"location254"}
      })
     })
 
   });
 
   describe('createUserRating', () => {
    it ('should provide rating of the script', () =>{
      const newUser: user ={
        name: "Beyonce",
        email: "Beyonce1234@gmail.com"
      };
     expect(apiAutomataScriptController.createUserRating(newUser, "script id", 3)).resolves.toEqual(
      {
        user: newUser,
        script: "script id",
        value: 3
      })
     })
 
   });

   describe('retrieveUserRating', () => {
    it ('should get rating of the script from specific user', () =>{
      const newUser: user ={
        name: "Beyonce",
        email: "Beyonce1234@gmail.com"
      };
     expect(apiAutomataScriptController.retrieveUserRating(newUser.name, newUser.email, "some script Id")).resolves.toEqual(
      {
        user: {name: newUser.name, email: newUser.email},
        script: "some script Id",
        value: 2
      })
     })
 
   });

   describe('countRating', () => {
    it ('should count the rating of script', () =>{
      expect(apiAutomataScriptController.countRating("some script Id")).resolves.toEqual(18)
    })
 
   });

  describe('averageRating', () => {
    it ('should display the average rating of a script', () =>{
      expect(apiAutomataScriptController.averageRating("some script Id")).resolves.toEqual(50)
    })
 
  });

  describe('checkForUpdatesForOne', () => {
    it ('should check for updated scripts', () =>{
      expect(apiAutomataScriptController.checkForUpdatesForOne("some script Id")).resolves.toEqual("This "+"some script Id"+" is found!")
    })
 
  });
  
  
  describe('getByGame', () => {
    it ('should check for updated scripts', () =>{
      expect(apiAutomataScriptController.getByGame("some board game Id")).resolves.toEqual(
        [{
          name: "Peter",
          author: {name:"Mark", email:"MarkDavids@gmail.com"},
          boardgame: "some board game Id",
          description: "This is a roots board game", 
          version: {major:2, minor:8, patch:8},
          size: 32, 
          icon:{name:"thisIcon3",key:"icon80",location:"Iconlocation3"},
          build:{name:"thisBuild",key:"key134",location:"thislocation3"},
          models:["thisisaModel3", "thisisanothermodel3"],
          iconSize:10, //base script 
          previous: ["Script1.2.5"],
          link:"www.thisisalink2.com",
          dateReleased: new Date("18-02-16"), 
          downloads: 8, 
          lastDownload: new Date("20-05-22"),
          export: true,
          comments: [],
          source: {name:"fileName3", key:"key313", location:"filelocation3"}
      }])
    });
 
  });

});



