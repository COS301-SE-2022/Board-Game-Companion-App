import { Test, TestingModule } from '@nestjs/testing';
import{ ApiAlertController } from './alert.controller';
import { AlertService } from '../../services/alert/alert.service';
import { Alert, AlertDocument } from '../../schemas/alert.schema';
import { user } from '../../models/general/user';

const newUser: user= {
  name: "user1",
  email: "user1@gmail.com"
}
const mockAlertDoc: Alert & Partial<Document> = {
  recepient: newUser,
  date: new Date("12-08-20"),
  link: "www.mylink.com",
  alertType: 3,
  read: true,
}

/************************************unit test****************************************/
describe('ApiAlertController', ()=>{
  let controller: ApiAlertController;
  let service: AlertService;

  beforeEach(async ()=>{
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ApiAlertController],
      providers: [
        {
          provide: AlertService,
          useValue: {
            getAllUserMessages: jest.fn().mockImplementation((name:string, email:string)=>
            Promise.resolve([mockAlertDoc]),),
            getAllUnReadUserMessages: jest.fn().mockImplementation((name:string, email:string)=>
            Promise.resolve([mockAlertDoc])),
            markAsRead: jest.fn().mockImplementation((id:string)=>
              Promise.resolve(mockAlertDoc),
            ),
          }
        }
      ]
    }).compile();

    controller = module.get<ApiAlertController>(ApiAlertController);
    service =module.get<AlertService>(AlertService);
  });

  it('should be defined', ()=>{
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('getAllUserMessages', ()=>{
    it('should get all user messages', ()=>{
      expect(controller.getAllUserMessages("user1", "user1@gmail.com")).resolves.toEqual([mockAlertDoc]);
    });
  });

  describe('getAllUnReadUserMessages', ()=>{
    it('should get all unread user messages', ()=>{
      expect(controller.getAllUnReadUserMessages("user1", "user1@gmail.com")).resolves.toEqual([mockAlertDoc]);
    });
  });
  
  describe('markAsRead', ()=>{
    it('should mark messages as read', ()=>{
      expect(controller.markAsRead("someID")).resolves.toEqual(mockAlertDoc)
    })
  })
});

