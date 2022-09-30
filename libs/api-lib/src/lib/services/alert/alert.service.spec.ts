import { Test, TestingModule } from '@nestjs/testing';
import { Model, Query } from 'mongoose';
import { getModelToken, InjectModel } from '@nestjs/mongoose';
import { Alert, AlertDocument } from '../../schemas/alert.schema';
import { user } from '../../models/general/user';
import { AutomataScript, AutomataScriptDocument } from '../../schemas/automata-script.schema';
import { OldScript, OldScriptDocument } from '../../schemas/old-script.schema';
import { AlertService } from './alert.service';
import { SocketGateway } from '../socket/socket.gateway';

/*************************************************unit test**********************************************/

describe('AlertService', ()=>{
  let service: AlertService; 
  let model: Model<AlertDocument>; 

  const user1 : user ={
    name: "user1",
    email: "user1@gmail.com"
  };

  const mockAlert = (mock?:Partial<Alert>): Partial<AlertDocument>=>({
    recepient: mock?.recepient || {name:"user1", email:"user1@gmail.com"},
    date: mock?.date || new Date("20-02-15"), 
    link: mock?.link || "www.link.com", 
    alertType: mock?.alertType || 2,
    read: mock?.read || false,
  });

  beforeEach(async()=> {
    const moduleRef: TestingModule= await Test.createTestingModule({
      providers:[
        AlertService, SocketGateway, 
        {
          provide: getModelToken(Alert.name),
          useValue:{
            new: jest.fn().mockResolvedValue(mockAlert()),
            constructor: jest.fn().mockResolvedValue(mockAlert()),
            find: jest.fn(()=>{
              return mockAlert
            }),
            findById: jest.fn(()=>{
              return mockAlert
            }),
            exec: jest.fn(),
            save: jest.fn(()=>{
              return mockAlert
            })
          },
        },
        {
          provide: getModelToken(AutomataScript.name),
          useValue:{
            new: jest.fn().mockResolvedValue(mockAlert()),
            constructor: jest.fn().mockResolvedValue(mockAlert()),
            find: jest.fn(),
            findById: jest.fn(),
            exec: jest.fn(),
          },
        },
        {
          provide: getModelToken(OldScript.name),
          useValue:{
            new: jest.fn().mockResolvedValue(mockAlert()),
            constructor: jest.fn().mockResolvedValue(mockAlert()),
            find: jest.fn(),
            findById: jest.fn(),
            exec: jest.fn(),
          },
        }
      ]
    }).compile();

    service = moduleRef.get<AlertService>(AlertService);
    model = moduleRef.get<Model<AlertDocument>>(getModelToken(Alert.name));
  });

  it('should be defined', ()=>{
    expect(service).toBeDefined();
    expect(model).toBeDefined();
  });

  afterEach(()=>{
    jest.clearAllMocks();
  });

  // describe('create', ()=>{
  //   it('should create an alert', async ()=>{
  //     service.create(user1,"www.link.com", 2).then(data=>{
  //       expect(data).toBe(mockAlert);
  //     });
  //   });
  // });

 describe('getAllUserMessages', ()=>{
  it('should get all user messages', async ()=>{
    return service.getAllUserMessages(user1).then(data=>{
      expect(data.toString()).toBe(([mockAlert]).toString());
    });
    
  });
  });

  describe('getAllUnReadUserMessages', ()=>{
    it('should get all unread messages', async()=>{
      return service.getAllUnReadUserMessages(user1).then(data=>{
        expect(data.toString()).toBe(([mockAlert]).toString());
      });
    });
  });

  // describe('markAsRead', ()=>{
  //   it('should mark an alert as read', async()=>{
  //     return service.markAsRead("some ID").then(data=>{
  //       expect(data.toString()).toBe(mockAlert.toString());
  //     });
      
  //   });
  // });
});