import { Test, TestingModule } from '@nestjs/testing';
import { user } from '../../models/general/user';
import { ApiDownloadScriptController } from '../downloads/downloads.controller';
import { DownloadsService } from '../../services/downloads/downloads.service';
import { update } from '../../models/general/update';
import { version } from '../../models/general/version';

/***************************************************Unit Test***********************************************/
describe('ApiDownloadScriptController', () => {
  let controller: ApiDownloadScriptController;
  let service: DownloadsService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ApiDownloadScriptController],
      providers:[{
        provide:DownloadsService, useValue:{
          alreadyDownloaded: jest.fn().mockImplementation((owner:user,author:user,name:string,version:version)=>
            Promise.resolve(true)
          ),
          update: jest.fn().mockImplementation((ids:update) => 
            Promise.resolve({
              name: ids.oldId, 
              author: {name:"tammy", email:"tammytaylor@gmail.com"}, 
              boardgame: "chess", 
              description: "third version", 
              version: {major:3, minor:0, patch:0},
              size: 12, 
              icon: {name:"download", key:"dwnld123", location:"app/icons"},
              build: {name:"build", key:"bld123", location:"./build"},
              models: ["string1", "string2"],
              iconSize: 4, //basescript 
              owner: {name:"user1", email:"user1@gmail.com"},
              link: "thisisalink",
              dateDownloaded: new Date("20-02-20")
            })
          ),
          getDownloadInfo: jest.fn().mockImplementation((id:string)=>
            Promise.resolve({
              name: id, 
              author: {name:"tammy", email:"tammytaylor@gmail.com"}, 
              boardgame: "chess", 
              description: "third version", 
              version: {major:3, minor:0, patch:0},
              size: 12, 
              icon: {name:"download", key:"dwnld123", location:"app/icons"},
              build: {name:"build", key:"bld123", location:"./build"},
              models: ["string1", "string2"],
              iconSize: 4, //basescript 
              previous: ["Script1", "Script2"], 
              link: "www.thisisAlink.com",
              dateReleased: new Date("31-03-16"),
              downloads: 11, 
              lastDownload: new Date("15-02-20"),
              export: true,
              comments: [], 
              rating: 2, 
              source: {name:"thisScript",key:"scrpt123", location:"files/scripts"}
            })
          ),
          getMyDownloads: jest.fn().mockImplementation((owner:user)=>
            Promise.resolve([
            {
              name: "baseScript", 
              author: {name:"tammy", email:"tammytaylor@gmail.com"}, 
              boardgame: "chess", 
              description: "third version", 
              version: {major:3, minor:0, patch:0},
              size: 12, 
              icon: {name:"download", key:"dwnld123", location:"app/icons"},
              build: {name:"build", key:"bld123", location:"./build"},
              models: ["string1", "string2"],
              iconSize: 4,//baseScript 
              owner: owner,
              link: "www.boardgame1.com",
              dateDownloaded: new Date("14-02-18")
            },
            {
              name: "baseScript", 
              author: {name:"tammy", email:"tammytaylor@gmail.com"}, 
              boardgame: "chess", 
              description: "third version", 
              version: {major:3, minor:0, patch:0},
              size: 12, 
              icon: {name:"download", key:"dwnld123", location:"app/icons"},
              build: {name:"build", key:"bld123", location:"./build"},
              models: ["string1", "string2"],
              iconSize: 4,//baseScript 
              owner: owner,
              link: "www.boardgame2.com",
              dateDownloaded: new Date("24-08-19")
            }])
          ),
          retrieveById: jest.fn().mockImplementation((id:string)=>
            Promise.resolve({
              name: id, 
              author: {name:"tammy", email:"tammytaylor@gmail.com"}, 
              boardgame: "chess", 
              description: "third version", 
              version: {major:3, minor:0, patch:0},
              size: 12, 
              icon: {name:"download", key:"dwnld123", location:"app/icons"},
              build: {name:"build", key:"bld123", location:"./build"},
              models: ["string1", "string2"],
              iconSize: 4, //basescript 
              owner:{name:"Jennifer", email:"JenniferBlob1232@gmail.com"},
              link:"www.chessGames.com",
              dateDownloaded: new Date("18-08-18")
            })
          ),
          removeScript: jest.fn().mockImplementation((id:string)=>
            Promise.resolve({
              name:id,
              author:{name:"", email:""}, 
              boardgame:"",
              description:"",
              version:{major:0,minor:0, patch:0}, 
              size:0,
              icon:{name:"",key:"",location:""},
              build:{name:"",key:"",location:""},
              models:[],
              iconSize:0, //baseScript
              owner: {name:"", email:""},
              link:"",
              dateDownloaded: new Date("")
            })
          ),
        }
      
      }]
    }).compile();

    controller = module.get<ApiDownloadScriptController>(ApiDownloadScriptController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('update', ()=>{
    
    it('should update the downloads', ()=>{
      const newUpdate : update ={
        oldId: "oldScriptname",
        newId: "newScriptname"
      }
      expect(controller.update(newUpdate)).resolves.toEqual({
        name: newUpdate.oldId, 
        author: {name:"tammy", email:"tammytaylor@gmail.com"}, 
        boardgame: "chess", 
        description: "third version", 
        version: {major:3, minor:0, patch:0},
        size: 12, 
        icon: {name:"download", key:"dwnld123", location:"app/icons"},
        build: {name:"build", key:"bld123", location:"./build"},
        models: ["string1", "string2"],
        iconSize: 4, //basescript 
        owner: {name:"user1", email:"user1@gmail.com"},
        link: "thisisalink",
        dateDownloaded: new Date("20-02-20")
      });

    });
  });

  describe('getDownloadInfo', ()=>{
    it('should get information about download', ()=>{
    expect(controller.getDownloadInfo("ScriptID")).resolves.toEqual({
      name: "ScriptID", 
      author: {name:"tammy", email:"tammytaylor@gmail.com"}, 
      boardgame: "chess", 
      description: "third version", 
      version: {major:3, minor:0, patch:0},
      size: 12, 
      icon: {name:"download", key:"dwnld123", location:"app/icons"},
      build: {name:"build", key:"bld123", location:"./build"},
      models: ["string1", "string2"],
      iconSize: 4, //basescript 
      previous: ["Script1", "Script2"], 
      link: "www.thisisAlink.com",
      dateReleased: new Date("31-03-16"),
      downloads: 11, 
      lastDownload: new Date("15-02-20"),
      export: true,
      comments: [], 
      rating: 2, 
      source: {name:"thisScript",key:"scrpt123", location:"files/scripts"}
    });
  });
  });

  describe('alreadDownloaded', ()=>{
    it('should check if script is already downloaded', ()=>{
      expect(controller.alreadDownloaded("sam","samrichard12@gmail.com", "author1", "author1@gmail.com","script20",2,0,7)).resolves.toEqual(true)
    });
  });

  describe('getMyDownloads', ()=>{
    it('should download the user downloads', ()=>{
      const newUser : user ={
        name: "Jennifer",
        email: "Jenniferalison@gmail.com"
      }
      expect(controller.getMyDownloads(newUser.name, newUser.email)).resolves.toEqual([
        {
          name: "baseScript", 
          author: {name:"tammy", email:"tammytaylor@gmail.com"}, 
          boardgame: "chess", 
          description: "third version", 
          version: {major:3, minor:0, patch:0},
          size: 12, 
          icon: {name:"download", key:"dwnld123", location:"app/icons"},
          build: {name:"build", key:"bld123", location:"./build"},
          models: ["string1", "string2"],
          iconSize: 4,//baseScript 
          owner: newUser,
          link: "www.boardgame1.com",
          dateDownloaded: new Date("14-02-18")
        },
        {
          name: "baseScript", 
          author: {name:"tammy", email:"tammytaylor@gmail.com"}, 
          boardgame: "chess", 
          description: "third version", 
          version: {major:3, minor:0, patch:0},
          size: 12, 
          icon: {name:"download", key:"dwnld123", location:"app/icons"},
          build: {name:"build", key:"bld123", location:"./build"},
          models: ["string1", "string2"],
          iconSize: 4,//baseScript 
          owner: newUser,
          link: "www.boardgame2.com",
          dateDownloaded: new Date("24-08-19")
        }
      ]);
    });
  });

  describe('retrieveById', ()=>{
    it('should get download by ID', ()=>{
      expect(controller.retrieveById("Script17")).resolves.toEqual({
        name: "Script17", 
        author: {name:"tammy", email:"tammytaylor@gmail.com"}, 
        boardgame: "chess", 
        description: "third version", 
        version: {major:3, minor:0, patch:0},
        size: 12, 
        icon: {name:"download", key:"dwnld123", location:"app/icons"},
        build: {name:"build", key:"bld123", location:"./build"},
        models: ["string1", "string2"],
        iconSize: 4, //basescript 
        owner:{name:"Jennifer", email:"JenniferBlob1232@gmail.com"},
        link:"www.chessGames.com",
        dateDownloaded: new Date("18-08-18")
      })
    });
  });

  describe('removeScript', ()=>{
    it('should remove the script of the given id', ()=>{
      expect(controller.removeScript("someID")).resolves.toEqual({
        name:"someID",
        author:{name:"", email:""}, 
        boardgame:"",
        description:"",
        version:{major:0,minor:0, patch:0}, 
        size:0,
        icon:{name:"",key:"",location:""},
        build:{name:"",key:"",location:""},
        models:[],
        iconSize:0, //baseScript
        owner: {name:"", email:""},
        link:"",
        dateDownloaded: new Date("")
      });
    });
  })


});
