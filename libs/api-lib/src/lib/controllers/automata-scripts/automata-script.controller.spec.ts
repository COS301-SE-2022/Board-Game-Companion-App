import { Test, TestingModule } from "@nestjs/testing"
import { AutomataService } from "../../services/automata/automata.service"
import { RatingService } from "../../services/ratings/rating.service"
import { ApiAutomataScriptController } from "../automata-scripts/automata-script.controller"
import { ModelsService } from "../../services/models/models.service";
import { MongoDbStorageService } from "../../services/mongodb-storage/mongodb-storage.service"
import { AutomataScript, AutomataScriptDocument } from "../../schemas/automata-script.schema"
import { OldScript, OldScriptDocument } from  "../../schemas/old-script.schema"
import { DownloadScript, DownloadScriptDocument } from "../../schemas/download-script.schema"
import mongoose, { Model } from "mongoose";
import { ApiLibModule } from "../../api-lib.module";
import { MongooseModule } from "@nestjs/mongoose";


jest.mock('../../services/automata/automata.service');
describe('AutomataScriptController',()=>{
  let automataService : AutomataService; 
  let apiAutomataScriptController: ApiAutomataScriptController;
  //let ratingService : RatingService;
  //let modelsService : ModelsService;
 // let MongoStorage : MongoDbStorageService;
 // let automataScriptDoc : Model<AutomataScriptDocument>;
 // let oldScriptDoc : Model<OldScriptDocument>;
 // let downloadScriptDoc : Model<DownloadScriptDocument>; 

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [ApiLibModule, MongooseModule],
      controllers: [ApiAutomataScriptController],
      providers: [AutomataService]
    }).compile();

    automataService = moduleRef.get<AutomataService>(AutomataService);
    apiAutomataScriptController = moduleRef.get<ApiAutomataScriptController>(ApiAutomataScriptController);
    //ratingService = moduleRef.get<RatingService>(RatingService);

  });

  describe('download', () => {
    it('should download the script', async () => {
      const result = new Promise<DownloadScript>((resolve, reject) => {
        resolve({
          name: "Base Script", 

          author: {name:"John",email:"JohnSmith@gmail.com"},
          
          boardgame: "Snakes and Ladders",
      
          description: "This is a base script",
          
          version: {major:0, minor: 0, patch: 0}, 
          
          size: 260,
      
          icon: {name:"iconName", key:"key123", location:"iconsFolder"},
          
          build: {name:"buildName", key:"buildkey123", location:"buildFolder"},
          
          models: ["myModel"],
      
          iconSize: 20,

          owner: {name:"John", email:"JohnSmith@gmail.com"},
            
          link: "www.thisisalink.com",
          
          dateDownloaded: new Date("28-01-19")
        })
      });
      
      jest.spyOn(automataService, 'download').mockImplementation(() => result);

      expect(await apiAutomataScriptController.download("4545","John","JohnSmith@gmail.com")).toBe(result);

    });

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

  describe('retrive-by-id', () => {
    it('should retrive a script by the id', async () => {
      const result = new Promise<AutomataScript>((resolve, reject) => {
        resolve({
          name: "Base Script", 

          author: {name:"John",email:"JohnSmith@gmail.com"},
          
          boardgame: "Snakes and Ladders",
      
          description: "This is a base script",
          
          version: {major:0, minor: 0, patch: 0}, 
          
          size: 260,
      
          icon: {name:"iconName", key:"key123", location:"iconsFolder"},
          
          build: {name:"buildName", key:"buildkey123", location:"buildFolder"},
          
          models: ["myModel"],
      
          iconSize: 20,
          //end of base script 
         
          previous: ["string1", "string2", "string3"],
          
          link: "www.thisisalink.com",
          
          dateReleased: new Date("15-04-15"),
      
          downloads: 15,
      
          lastDownload: new Date("30-02-19"),
          
          export: false,
      
          comments: [],
      
          source: {name:"sourceName",key:"sourcekey1234", location:"sourceLocation"}
        })
      });
      
      jest.spyOn(automataService, 'getScriptById').mockImplementation(()=> result);

      expect(await apiAutomataScriptController.getById("4545")).toBe(await result);

    });

  });

});



