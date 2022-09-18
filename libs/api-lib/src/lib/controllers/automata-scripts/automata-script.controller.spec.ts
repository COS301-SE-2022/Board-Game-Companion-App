import { Test, TestingModule } from "@nestjs/testing"
import { AutomataService } from "../../services/automata/automata.service"
import { RatingService } from "../../services/ratings/rating.service"
import { ApiAutomataScriptController } from "../automata-scripts/automata-script.controller"
import { ModelsService } from "../../services/models/models.service";
import { MongoDbStorageService } from "../../services/mongodb-storage/mongodb-storage.service"
import { AutomataScript, AutomataScriptDocument } from "../../schemas/automata-script.schema"
import { OldScript, OldScriptDocument } from  "../../schemas/old-script.schema"
import { DownloadScript, DownloadScriptDocument } from "../../schemas/download-script.schema"
import mongoose, { Model, Connection, connect } from "mongoose";
import { ApiLibModule } from "../../api-lib.module";
import { user } from "../../models/general/user";
import { version } from "../../models/general/version";


jest.mock('../../services/automata/automata.service');
describe('AutomataScriptController',()=>{
  let automataService : AutomataService; 
  let apiAutomataScriptController: ApiAutomataScriptController;
  let ratingService : RatingService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [ApiLibModule],
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
          value: 15
        })),
        average: jest.fn().mockResolvedValue(50),
        countRating: jest.fn().mockReturnValue(18)
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
          comments: [{commentId, ref:"David"}],
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
      remove: jest.fn().mockImplementation((id:string)=>
      Promise.reject({
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

  // describe('retrieve-all' , () => {
  //   it('should get all of the scripts', async () => {
  //     const result = new Promise<AutomataScript[]>((resolve, reject) => { 
  //       resolve([{ 
  //         name: "Base Script", 

  //         author: {name:"John",email:"JohnSmith@gmail.com"},
          
  //         boardgame: "Snakes and Ladders",
      
  //         description: "This is a base script",
          
  //         version: {major:0, minor: 0, patch: 0}, 
          
  //         size: 260,
      
  //         icon: {name:"iconName", key:"key123", location:"iconsFolder"},
          
  //         build: {name:"buildName", key:"buildkey123", location:"buildFolder"},
          
  //         models: ["myModel"],
      
  //         iconSize: 20,
  //         //end base script

  //         previous:["This", "Then", "That"],
            
  //         link: "www.thisisalink.com",

  //         dateReleased: new Date("28-01-19"),

  //         downloads: 10,
          
  //         lastDownload: new Date("28-07-19"),

  //         export: true,

  //         comments: [],

  //         source: {name:"sourceFile", key:"1234", location:"desktop"}
  //       },
  //       {
  //         name: "Base Script2", 

  //         author: {name:"Sam",email:"SamSmith@gmail.com"},
          
  //         boardgame: "Chess",
      
  //         description: "This is a base script",
          
  //         version: {major:0, minor: 0, patch: 0}, 
          
  //         size: 260,
      
  //         icon: {name:"iconName", key:"key342", location:"iconsFolder"},
          
  //         build: {name:"buildName", key:"buildkey342", location:"buildFolder"},
          
  //         models: ["myModel"],
      
  //         iconSize: 25,

  //         previous:["That", "Then", "This"],
            
  //         link: "www.thisisanotherlink.com",

  //         dateReleased: new Date("08-08-18"),

  //         downloads: 10,
          
  //         lastDownload: new Date("22-02-22"),

  //         export: false,

  //         comments: [],

  //         source: {name:"sourceFile", key:"1234", location:"desktop"}
  //       }])
  //     });
  //   jest.spyOn(automataService, 'retrieve-all').mockImplementation(()=> result);

  //   expect(await apiAutomataScriptController.getAll()).toBe(await result);

  //   })
  // })

  // describe('retrive-by-id', () => {
  //   it('should retrive a script by the id', async () => {
  //     const result = new Promise<AutomataScript>((resolve, reject) => {
  //       resolve({
  //         name: "Base Script", 

  //         author: {name:"John",email:"JohnSmith@gmail.com"},
          
  //         boardgame: "Snakes and Ladders",
      
  //         description: "This is a base script",
          
  //         version: {major:0, minor: 0, patch: 0}, 
          
  //         size: 260,
      
  //         icon: {name:"iconName", key:"key123", location:"iconsFolder"},
          
  //         build: {name:"buildName", key:"buildkey123", location:"buildFolder"},
          
  //         models: ["myModel"],
      
  //         iconSize: 20,
  //         //end of base script 
         
  //         previous: ["string1", "string2", "string3"],
          
  //         link: "www.thisisalink.com",
          
  //         dateReleased: new Date("15-04-15"),
      
  //         downloads: 15,
      
  //         lastDownload: new Date("30-02-19"),
          
  //         export: false,
      
  //         comments: [],
      
  //         source: {name:"sourceName",key:"sourcekey1234", location:"sourceLocation"}
  //       })
  //     });
      
  //     jest.spyOn(automataService, 'getScriptById').mockImplementation(()=> result);

  //     expect(await apiAutomataScriptController.getById("4545")).toBe(await result);

  //   });

  // });

});



