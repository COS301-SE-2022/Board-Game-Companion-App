import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Comment } from '../../schemas/comment.schema';
import { Like } from '../../schemas/like.schema';
import { ModelsService } from '../models/models.service';
import { MemoryStoredFile } from 'nestjs-form-data';
import { user } from '../../models/general/user';
import { NeuralNetwork, NeuralNetworkDocument } from '../../schemas/neural-network.schema';
import { MongoDbStorageService } from '../mongodb-storage/mongodb-storage.service';
import { File } from '../../schemas/file.schema';
import { NeuralNetworkDiscriminator } from '../../models/general/modelDiscriminator'

describe('CommentService', () => {
   let service: ModelsService;

   const myMemory=  new MemoryStoredFile();
   
   const myWeight= new MemoryStoredFile();

  // NeuralNetworkDiscriminator thisNetwork;

   const newUser: user ={
    name: "user1", 
    email: "user1@gmail.com"
  }

  const thisDate = new Date("12-01-18");

  // const myNeural: NeuralNetwork = {
  //   creator: newUser,
  //   name: "modelName",
  //   created: thisDate,
  //   labels: [],
  //   min: [0, 1],
  //   max: [8, 9],
  //   model: { name: "memoryName", key: "mem112", location: "./desktop/memory" },
  //   weights: { name: "myweight", key: "www112", location: "./desktop/memory" },
  //   discriminator: 3,
  //   loss: 0,
  //   accuracy: 0
  // }



   const mockRepository = {
     find() {
       return {};
     }
   };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ModelsService,  MongoDbStorageService, 
        { 
          provide: getModelToken(Comment.name),
          useValue: mockRepository
      },  { 
        provide: getModelToken(Like.name),
        useValue: mockRepository
    }, {
      provide: getModelToken(NeuralNetwork.name),
      useValue: {}
    },{
      provide: getModelToken(File.name),
      useValue: {}
    }],
    }).compile();

    service = module.get<ModelsService>(ModelsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // describe('create', ()=>{
  //   it('should create a model', async()=>{
  //       expect(service.create(myMemory,myWeight,newUser, "modelName",thisDate,[0,1],[8,9],[])).resolves.toEqual(myNeural);
  //   });
  // });

  // describe('alreadExists', ()=>{
  //   it('should check if the model already exists', async()=>{
  //     expect(service.alreadExists(newUser, "modelName")).resolves.toEqual(true);
  //   });
  // });

  // describe('getAll', ()=>{
  //   it('should get all models', async()=>{
  //     expect(service.getAll(newUser)).resolves.toEqual([myNeural]);
  //   });
  // });

  // describe('remove', ()=>{
  //   it('should remove the model', async()=>{
  //     expect(service.remove("some ID")).resolves.toEqual(true);
  //   });
  // });

  // describe('removeById', ()=>{
  //   it('should remove specific model', async()=>{
  //       expect(service.removeById("some ID")).resolves.toEqual(myNeural);
  //   });
  // });

  // describe('getModel', ()=>{
  //   it('should get the model', async()=>{
  //     expect(service.getModel(newUser,"some ID")).resolves.toEqual(myNeural);
  //   });
  // });

  // describe('getModelByName', ()=>{
  //   it('should get model by its name', async()=>{
  //     expect(service.getModelByName(newUser, "model")).resolves.toEqual(myNeural);
  //   });
  // });

  // describe('getModels', ()=>{
  //   it('should get all the models', async()=>{
  //     expect(service.getModel(newUser, "some ID")).resolves.toEqual([myNeural])
  //   })
  // });

  // describe('getModelsByIdOnly', ()=>{
  //   it('should get models by its id', async()=>{
  //     expect(service.getModelsByIdOnly(["some ID"])).resolves.toEqual([myNeural])
  //   });
  // });

  // describe('copyModel', ()=>{
  //   it('should copy model', async()=>{
  //     expect(service.copyModel("some ID", thisNetwork)).resolves.toEqual("The Model has been copied")
  //   });
  // });
});
