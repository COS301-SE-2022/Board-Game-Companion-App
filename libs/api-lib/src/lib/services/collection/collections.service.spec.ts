import { Injectable, HttpStatus , HttpException } from '@nestjs/common';
import { Collection,CollectionDocument } from '../../schemas/collection.schema';
import { Test, TestingModule } from '@nestjs/testing';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { model, Model } from 'mongoose';
import { user } from '../../models/general/user';
import { collectionDto } from '../../models/dto/collectionDto';
import { AutomataScript, AutomataScriptDocument } from '../../schemas/automata-script.schema';
import { CollectionsService } from './collections.service'
import { getModelToken } from '@nestjs/mongoose';

/*************************************************unit test**********************************************/


describe('CollectionsService', ()=>{
  let service: CollectionsService;
  let collectionModel: Model<CollectionDocument>;
  let automataModel:  Model<AutomataScriptDocument>; 

  const newUser : user ={
    name: "user1",
    email: "user1@tuks.com",
  }

  const mockCollection : Collection ={
    owner: {name:"user1", email:"user1@tuks.com"},
    name: "MyCollection",
    boardgames: ["Chess", "Monopoly", "roots"]
  };

  const mockCollDoc = (mock?: Partial<Collection>): Partial<CollectionDocument> => ({
    owner: mock?.owner || {name:"user1", email:"user1@tuks.com"}, 
    name: mock?.name || "MyCollection",
    boardgames: mock?.boardgames || ["Chess", "Monopoly", "roots"],
  });

  const mockScript : AutomataScript ={
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
      previous: ["Script10","Script11", "Script09"],
      link: "www.somelink.com", 
      dateReleased: new Date("02-09-21"),
      downloads : 11,
      lastDownload: new Date("13-01-22"),
      export: true, 
      comments: [],
      rating: 4,
      source: {name:"sourceFile", key:"key123", location:"thatLocation"}
  }
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CollectionsService,
        {
          provide: getModelToken(Collection.name),
          useValue:{
            new: jest.fn().mockResolvedValue(mockCollection),
            constructor: jest.fn().mockResolvedValue(mockCollection),
            find: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
            create: jest.fn().mockImplementationOnce((dto:collectionDto)=>
            Promise.resolve({
              owner: dto.owner,
              name: dto.name,
              boardgames: dto.boardgames,
            }),),
            exec: jest.fn(),
          }
        },
        {
          provide: getModelToken(AutomataScript.name),
          useValue:{
            new: jest.fn().mockResolvedValue(mockScript),
            constructor: jest.fn().mockResolvedValue(mockScript),
            find: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            create: jest.fn(),
            remove: jest.fn(),
            exec: jest.fn(),
          }
        }
      ],
    }).compile();

    service = module.get<CollectionsService>(CollectionsService);
    collectionModel = module.get<Model<CollectionDocument>>(getModelToken(Collection.name));
    automataModel = module.get<Model<AutomataScriptDocument>>(getModelToken(AutomataScript.name));

  });

  it('should be defined', ()=>{
    expect(service).toBeDefined();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', ()=>{
    it('should create a collection',  async()=>{
      expect(service.create("script12",newUser)).resolves.toEqual(mockCollection)
    });
  });

  describe('alreadyExist', ()=>{
    it('should check if the collection already exists', async()=>{
      expect(service.alreadyExist(newUser,"script12")).resolves.toEqual(true)
    });
  });

  describe('getCollectionsByUser', ()=>{
    it('should get the users collection', async()=>{
      expect(service.getCollectionsByUser(newUser)).resolves.toEqual([mockCollection])
    });
  });


  describe('getAllCollections', ()=>{
    it('should get all collections', async()=>{
      expect(service.getAllCollections()).resolves.toEqual([mockCollDoc])
    });
  });


  describe('addBoardGame', ()=>{
    it('should add a board game to a collection', async()=>{
      expect(service.addBoardGame("chess", "script20", newUser)).resolves.toEqual(true)
    });
  });

  describe('removeBoardGame', ()=>{
    it('should remove a board game', async()=>{
      expect(service.removeBoardGame("chess","script20", newUser)).resolves.toEqual(1)
    });
  });

  describe('removeCollectionById', ()=>{
    it('should remove the specified collection', async()=>{
      expect(service.removeCollectionById("some ID")).resolves.toEqual(1)
    })
  });

  describe('removeCollection', ()=>{
    it('remove a collection', async()=>{
      expect(service.removeCollection(newUser,"script12")).resolves.toEqual(1)
    });
  });

  describe('getScripts', ()=>{
    it('should get all scripts', async()=>{
      expect(service.getScripts("some ID")).resolves.toEqual([mockScript])
    });
  });
})