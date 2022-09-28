import { user } from '../../models/general/user';
import { Controller, Post, Body, Get, Query, HttpException, HttpStatus, Delete, Param  } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ModelsService } from '../../services/models/models.service';
import { ApiModelsController } from '../../controllers/models/models.controller';
import { FormDataRequest, MemoryStoredFile } from 'nestjs-form-data';
import { neuralnetworkDto } from '../../models/dto/neuralnetworkDto';
import { NeuralNetwork } from '../../schemas/neural-network.schema';
import { NeuralNetworkDiscriminator } from '../../models/general/modelDiscriminator'

jest.mock('../../services/models/models.service')
/***************************************************Unit Test***********************************************/

describe('ApiModelsController', ()=>{
  let controller: ApiModelsController;
  let service: ModelsService;

  beforeEach(async ()=>{
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ApiModelsController],
      providers: [
        {
        provide: ModelsService,
        useValue:{
        create: jest.fn().mockImplementation((model:MemoryStoredFile,weights:MemoryStoredFile,user:user,name:string,created:Date,type:string,min:number[],max:number[],accuracy:number,loss:number,labels:string[])=>
          Promise.resolve({
            creator: user,
            name: name,
            created: created, 
            accuracy: accuracy,
            loss: loss,
            type: type,
            labels: labels,
            min: min,
            max: max,
            model: model,
            weights: weights,
            discriminator:8
          })
        ),
        alreadExists: jest.fn().mockImplementation((user:user,name:string)=>
          Promise.resolve(true)
        ),
        getAll: jest.fn().mockImplementation((user:user)=>
        Promise.resolve({
          creator: user, 
          name: "name",
          created: new Date("01-10-20"), 
          accuracy: 23,
          loss: 13, 
          type: "type", 
          labels: ["label1", "label2"],
          min:[1,2], 
          max:[8,9],
          model: {name:"file", key:"00", location:"./location"},
          weights: {name:"wfile", key:"01", location:"./location"},
          discriminator: 8
        })
        ),
        getModel: jest.fn().mockImplementation((user:user,id:string)=>
        Promise.resolve({
          creator: user, 
          name: id,
          created: new Date("01-10-20"), 
          accuracy: 23,
          loss: 13, 
          type: "type", 
          labels: ["label1", "label2"],
          min:[1,2], 
          max:[8,9],
          model: {name:"file", key:"00", location:"./location"},
          weights: {name:"wfile", key:"01", location:"./location"},
          discriminator: 8
        })
        ), 
        // getModels: jest.fn().mockImplementation(),
        getModelsByIdOnly: jest.fn().mockImplementation((idList:string[])=>{
        Promise.resolve([{
            creator: "user1", 
            name: idList[0],
            created: new Date("01-10-20"), 
            accuracy: 23,
            loss: 13, 
            type: "type", 
            labels: ["label1", "label2"],
            min:[1,2], 
            max:[8,9],
            model: {name:"file", key:"00", location:"./location"},
            weights: {name:"wfile", key:"01", location:"./location"},
            discriminator: 8
        },
        {
            creator: "user2", 
            name: idList[1],
            created: new Date("01-10-20"), 
            accuracy: 23,
            loss: 13, 
            type: "type", 
            labels: ["label1", "label2"],
            min:[1,2], 
            max:[8,9],
            model: {name:"file", key:"00", location:"./location"},
            weights: {name:"wfile", key:"01", location:"./location"},
            discriminator: 8
        }])
        }),
        //copyModel: jest.fn().mockImplementation((id:string,location:NeuralNetworkDiscriminator))
        }
      }]
    }).compile();

    controller = module.get<ApiModelsController>(ApiModelsController);
    service = module.get<ModelsService>(ModelsService);
  })

  it('should be defined', () => {
    expect('models').toBeTruthy();
  });
  
  describe('create', ()=>{
    it('should create a model', ()=>{
      const _created = new Date("15-03-16");
      const _buffer = new Buffer("buffer string");
      const _stored : MemoryStoredFile ={
        mimetype: ".json",
        encoding: "Encoding of some sort", 
        originalName: "Myfile",
        size: 14, 
        buffer: _buffer,
        async delete():Promise<void>{
          Promise.resolve("Deleted!")
        }
      };
      const _weights : MemoryStoredFile ={
        mimetype: ".bin",
        encoding: "Encoding of some sort2", 
        originalName: "MyWeights",
        size: 7, 
        buffer: _buffer,
        async delete():Promise<void>{
          Promise.resolve("Deleted!")
        }
      };
      expect(controller.create("user1", "user1@gmail.com", "myScript", _created, 50, 1, "neural", "scripting","1,2,3","8,9,10",_stored,_weights)).resolves.toEqual({
        creator: {name:"user1", email:"user1@gmail.com"},
        name: "myScript", 
        created: _created, 
        accuracy: 50, 
        loss: 1, 
        type: "neural", 
        labels: ["scripting"], 
        min:[1,2,3],
        max:[8,9,10],
        model:{name:_stored.originalName,key:"model123",location:_stored.mimetype},
        weights:{name:_weights.originalName, key:"weight456",location:_weights.mimetype},
        discriminator: 8
      })
    });
  });

  describe('getall', ()=>{
    it('get all models owned by user', ()=>{
      expect(controller.getAll("sindi", "sindi1@gmail.com")).resolves.toEqual([{
        creator: {name:"sindi", email:"sindi1@gmail.com"}, 
        name: "name",
        created: new Date("01-10-20"), 
        accuracy: 23,
        loss: 13, 
        type: "type", 
        labels: ["label1", "label2"],
        min:[1,2], 
        max:[8,9],
        model: {name:"file", key:"00", location:"./location"},
        weights: {name:"wfile", key:"01", location:"./location"},
        discriminator: 8
      }])
    });
  })
})