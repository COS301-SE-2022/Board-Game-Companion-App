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
import { Controller, Body,  Get, Query, Post, Put, Delete ,UploadedFile, UseInterceptors, Param, HttpException, HttpStatus } from '@nestjs/common';

import { user } from "../../models/general/user";
import { version } from "../../models/general/version";
import { Rating } from "../../schemas/rating.schema";


jest.mock('../../services/automata/automata.service');
/***************************************************Unit Test***********************************************/
describe('AutomataScriptController',()=>{
  let automataService : AutomataService; 
  let controller: ApiAutomataScriptController;
  let ratingService : RatingService;

  const newUser: user ={
    name:"user1",
    email: "user1@gmail.com"
  }
  const mockdownloadScript: DownloadScript =
  {
    name: "Samuel",
    author: {name:"David", email:"Davidjones@gmail.com"},
    boardgame: "monopoly",
    description: "This is a monopoly board game", 
    version: {major:8, minor:8, patch:8},
    size: 32, 
    icon:{name:"thisIcon2",key:"icon890",location:"Iconlocation2"},
    build:{name:"thisBuild",key:"key1234",location:"thislocation2"},
    models:["thisisaModel2", "thisisanothermodel2"],
    iconSize:10,// base script 
    owner: newUser,
    link: "www.thisnewlinkexample.com",
    dateDownloaded: new Date("11-02-16")
  }

  const oldScript: OldScript ={
    name: "Jake",
      author: {name:"David", email:"Davidjones@gmail.com"},
      boardgame: "monopoly",
      description: "This is a monopoly board game", 
      version: {major:8, minor:8, patch:8},
      size: 32, 
      icon:{name:"thisIcon2",key:"icon890",location:"Iconlocation2"},
      build:{name:"thisBuild",key:"key1234",location:"thislocation2"},
      models: ["a string of idLists"],
      iconSize:10, //baseScript
      previous: [],
      dateReleased: new Date("11-02-16"),
      downloads: 5,
      lastDownload: new Date("10-09-21"),
      export: false,
      comments: [],
      rating: 8,
      source: {name:"Source3", key:"key2323", location:"location254"}
  }

  const automataScript: AutomataScript ={
      name: "Jake",
      author: {name:"David", email:"Davidjones@gmail.com"},
      boardgame: "monopoly",
      description: "This is a monopoly board game", 
      version: {major:8, minor:8, patch:8},
      size: 32, 
      icon:{name:"thisIcon2",key:"icon890",location:"Iconlocation2"},
      build:{name:"thisBuild",key:"key1234",location:"thislocation2"},
      models: ["a string of idLists"],
      iconSize:10, //baseScript
      previous: [],
      link: "www.someLink.com",
      dateReleased: new Date("11-02-16"),
      downloads: 5,
      lastDownload: new Date("10-09-21"),
      export: false,
      comments: [],
      rating: 8,
      source: {name:"Source3", key:"key2323", location:"location254"}
  }
  const myRating: Rating ={
    user: newUser,
    script: "monopoly",
    value: 5,
  }


  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [ApiAutomataScriptController],
      providers: [
        //Rating Service
        {provide:RatingService,
          useValue:{
        rate: jest.fn().mockImplementation((user:user,script:string,value:number) =>
        Promise.resolve(myRating),),
        getRating: jest.fn().mockImplementation((user:user,script:string) =>
        Promise.resolve(myRating)),
        average: jest.fn().mockResolvedValue(50),
        countRating: jest.fn().mockResolvedValue(4),
      }},
      //AutomataService
      { provide:AutomataService,
        useValue:{
        getAll: jest.fn().mockResolvedValue([automataScript]),
        download: jest.fn().mockImplementation((id:string,owner:user) =>
          Promise.resolve(mockdownloadScript)),
        getOldVersions: jest.fn().mockImplementation((idList:string)=>
          Promise.resolve([oldScript]),),
        getAllOld: jest.fn().mockResolvedValue([oldScript]),
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
          Promise.resolve(automataScript),),
      getScriptById: jest.fn().mockImplementation((id:string) => 
      Promise.resolve(automataScript),),
      
      checkVersion: jest.fn().mockReturnValue({result:true}),
      checkForUpdatesForOne: jest.fn().mockImplementation((id:string) =>
        Promise.resolve("This "+id+" is found!")
      ),
      getByGame: jest.fn().mockReturnValue([automataScript]),
      }}]
    }).compile();

    automataService = moduleRef.get<AutomataService>(AutomataService);
    ratingService = moduleRef.get<RatingService>(RatingService);
    controller = moduleRef.get<ApiAutomataScriptController>(ApiAutomataScriptController);
  
  });

  it('should be defined', ()=>{
    expect(controller).toBeDefined();
    expect(automataService).toBeDefined();
    expect(ratingService).toBeDefined();
  });

  describe('download', () => {
   it ('should download the script', () =>{
    expect(controller.download("a string id",newUser.name,newUser.email)).resolves.toStrictEqual(mockdownloadScript)
    });
  });

  describe('getOldVersions', () => {
    it ('should get older versions of the script',  () =>{
      controller.getOldVersions(JSON.stringify(("Jake"))).then(function(response){
        expect(response).toStrictEqual([oldScript]);
        
      });
    });
  });

 
   describe('getAll', () => {
    it ('should return all scripts', () =>{
    expect(controller.getAll()).resolves.toEqual([automataScript])
     })
 
   });

   describe('getAllOld', ()=>{
    it('should get all old versions of scripts', ()=>{
      expect(controller.getAllOld()).resolves.toEqual([oldScript])
    })
   });

   describe('getById', () => {
    it ('should return a script with the provided id', () =>{
    
     expect(controller.getById("some string id")).resolves.toEqual(automataScript)
     })
   });

   describe('addComment', () => {
    it ('should return a script with the provided id', () =>{
     expect(controller.addComment("some script id", "some comment id")).toBeDefined();
     })
   });
 
   describe('createUserRating', () => {
    it ('should provide rating of the script', () =>{
     expect(controller.createUserRating(newUser, "script id", 3)).resolves.toEqual(myRating)
    })
 
   });

   describe('retrieveUserRating', () => {
    it ('should get rating of the script from specific user', () =>{
     expect(controller.retrieveUserRating(newUser.name, newUser.email, "some script Id")).resolves.toEqual(myRating)
     })
 
   });

   describe('countRating', () => {
    it ('should count the rating of script', () =>{
      expect(controller.countRating("some script Id")).resolves.toEqual(4)
    })
 
   });

  describe('averageRating', () => {
    it ('should display the average rating of a script', () =>{
      expect(controller.averageRating("some script Id")).resolves.toEqual(50)
    })
 
  });

  describe('checkForUpdatesForOne', () => {
    it ('should check for updated scripts', () =>{
      expect(controller.checkForUpdatesForOne("some script Id")).resolves.toEqual("This "+"some script Id"+" is found!")
    })
 
  });
  
  
  describe('getByGame', () => {
    it ('should check for updated scripts', () =>{
      expect(controller.getByGame("some board game Id")).resolves.toEqual([automataScript])
    });
 
  });

});