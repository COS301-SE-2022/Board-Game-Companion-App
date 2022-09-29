import { Test, TestingModule } from '@nestjs/testing';
import { ApiAdminController } from '../admin/admin.controller'; 
import { AdminService } from '../../services/admin/admin.service';
import { AlertDocument } from '../../schemas/alert.schema';
import { userSearch } from '../../models/general/userSearch';
import { Moderator } from '../../schemas/moderator.schema';
import { Ban } from '../../schemas/ban.schema';
import { user } from '../../models/general/user';


const moderator: Moderator={
  email: "Nasiphi@gmail.com",
  admin: true,
};

const ban: Ban ={
  account: {name: "Beyonce", email:"Beyonce@gmail.com"},
}

const srchResult : userSearch={
    name: "user1",
    email:"user1@gmail.com",
    downloads:3,
    collections:4,
    authored:5,
    models:6,
    banned:false,
}

describe('ApiAdminController', ()=>{
  let controller: ApiAdminController;
  let service: AdminService;

  beforeEach(async ()=>{
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ApiAdminController],
      providers: [
        {
          provide: AdminService,
          useValue:{
            create: jest.fn().mockImplementation((email:string)=>
            Promise.resolve({
              email: email,
              admin: true
            }),),
            setAdmin: jest.fn().mockImplementation((email:string, admin: boolean)=>
            Promise.resolve({
              email: email,
              admin: admin
            }),
            ),
            getAll: jest.fn().mockResolvedValue([moderator]),
            getTotalAccounts: jest.fn().mockResolvedValue(5),
            remove: jest.fn().mockImplementation((id:string)=>
            Promise.resolve(moderator),),
            ban: jest.fn().mockImplementation((name:string,email:string)=>
            Promise.resolve({
              account:{name:name, email:email}
            }),
            ),
            banned: jest.fn().mockImplementation((name:string, email:string)=>
            Promise.resolve(true),),
            isAdmin: jest.fn().mockImplementation((id:string)=>
            Promise.resolve(true),), 
            unban: jest.fn().mockImplementation((email:string)=>
            Promise.resolve(ban),),
            warn: jest.fn().mockImplementation((name:string, email:string, message:string)=>
            Promise.resolve({
              name:name,
              message: message,
            }),
            ),
            search: jest.fn().mockImplementation((user1:string)=>
            Promise.resolve([srchResult]),),
            countDownloaders: jest.fn().mockResolvedValue(10),
            countCollectionOwners:jest.fn().mockResolvedValue(2), 
            getActiveAccounts: jest.fn().mockResolvedValue(1),
            getLoggedInUsers: jest.fn().mockResolvedValue(2),
            countScriptAuthors: jest.fn().mockResolvedValue(3),
          }
        }
      ]
    }).compile();

    controller = module.get<ApiAdminController>(ApiAdminController);
    service = module.get<AdminService>(AdminService);
  });

  it('should be defined', ()=>{
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('create', ()=>{
    it('should create an admin', ()=>{
      expect(controller.create("Nasiphi@gmail.com")).resolves.toEqual(moderator);
    });
  });

  describe('setAdmin', ()=>{
    it('should set the user to admin', ()=>{
      expect(controller.setAdmin("Nasiphi@gmail.com", true)).resolves.toEqual(moderator);
    })
  });

  describe('getAll', ()=>{
    it('should get all admins', ()=>{
      expect(controller.getAll()).resolves.toEqual([moderator]);
    })
  });

  describe('getTotalAccounts', ()=>{
    it('should get the total number of admins', ()=>{
      expect(controller.getActiveAccounts()).resolves.toEqual(5);
    })
  });

  describe('remove', ()=>{
    it('should remove an admin user', ()=>{
      expect(controller.remove("Nasiphi@gmail.com")).resolves.toEqual(moderator);
    });
  });

  describe('ban', ()=>{
    it('should ban this user', ()=>{
      expect(controller.ban("Beyonce", "Beyonce@gmail.com")).resolves.toEqual(ban);
    });
  });

  describe('banned',()=>{
    it('should show banned accounts', ()=>{
      expect(controller.banned("Beyonce", "Beyonce@gmail.com")).resolves.toEqual(true);
    })
  });

  describe('isAdmin', ()=>{
    it('should check if the user is an admin user', ()=>{
      expect(controller.isAdmin("Nasiphi@gmail.com")).resolves.toEqual(true);
    })
  });

  describe('unban', ()=>{
    it('should unban this banned account', ()=>{
      expect(controller.unban("Nasiphi@gmail.com")).resolves.toEqual(ban)
    });
  });

  describe('warn',()=>{
    it('should warn the user', ()=>{
      expect(controller.warn("Nasiphi", "Nasiphi@gmail.com","Get out!!")).resolves.toEqual({name:"Nasiphi", message:"Get out!!"})
    })
  });

  describe('search',()=>{
    it('should serach for a user', ()=>{
      expect(controller.search("user1")).resolves.toEqual([srchResult]);
    })
  });

  describe('countDownloaders',()=>{
    it('should count the number of users that downloaded scripts', ()=>{
      expect(controller.countDownloaders()).resolves.toEqual(10)
    });
  });

  describe('countCollectionOwners', ()=>{
    it('should count the number of users who own collections', ()=>{
      expect(controller.countCollectionOwners()).resolves.toEqual(2);
    });
  });

  describe('getActiveAccounts', ()=>{
    it('should get all active users',()=>{
      expect(controller.getActiveAccounts()).resolves.toEqual(1);
    });
  });

  describe('getLoggedInUsers', ()=>{
    it('should get logged in users', ()=>{
      expect(controller.getLoggedInUsers()).resolves.toEqual(2);
    });
  });

  describe('countScriptAuthors', ()=>{
    it('should count number of script authors', ()=>{
      expect(controller.countScriptAuthors()).resolves.toEqual(3)
    })
  });
});
