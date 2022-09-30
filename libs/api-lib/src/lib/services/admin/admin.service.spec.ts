import { Test, TestingModule } from '@nestjs/testing';
import { Model, Query } from 'mongoose';
import { getModelToken, InjectModel } from '@nestjs/mongoose';
import { AutomataScript, AutomataScriptDocument } from '../../schemas/automata-script.schema';
import { OldScript, OldScriptDocument } from '../../schemas/old-script.schema';
import { Collection, CollectionDocument } from '../../schemas/collection.schema';
import { DownloadScript, DownloadScriptDocument } from '../../schemas/download-script.schema';
import { NeuralNetwork, NeuralNetworkDocument } from '../../schemas/neural-network.schema';
import { MyScript, MyScriptDocument } from '../../schemas/my-script.schema';
import { Moderator, ModeratorDocument } from '../../schemas/moderator.schema';
import { Ban, BanDocument } from '../../schemas/ban.schema';
import { user } from '../../models/general/user';
import { AdminService } from './admin.service';
import { AlertService } from '../alert/alert.service';
import { SocketGateway } from '../socket/socket.gateway';
import { alertType } from '../../models/general/alertType';
import { Alert, AlertDocument } from '../../schemas/alert.schema';
import { userSearch } from '../../models/general/userSearch';


/*************************************************unit test**********************************************/

describe('AlertService', ()=>{
  let service: AdminService; 
  let automataModel: Model<AutomataScriptDocument>; 
  let myscriptModel: Model<MyScriptDocument>;
  let downloadModel: Model<DownloadScriptDocument>;
  let oldModel: Model<OldScriptDocument>;
  let collectionModel: Model<CollectionDocument>;
  let moderatorModel: Model<ModeratorDocument>;
  let networkModel: Model<NeuralNetworkDocument>;
  let banModel: Model<BanDocument>;
  let alertService:AlertService;
  let alertModel: Model<AlertDocument>;


  const user1 : user ={
    name: "user1",
    email: "user1@gmail.com"
  };

  const userSearch: userSearch={
    name: "script12",
    email:"user1@gmail.com",
    downloads:3,
    collections:4,
    authored:5,
    models:6,
    banned:false,
  }

  const mockModerator : Moderator ={
    email: "user1@gmail.com",
    admin: true,
  }
  const mockBan : Ban ={
    account: user1 
  } 
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
        AdminService, AlertService,
        {
            provide: SocketGateway,
            useValue:{
                save: jest.fn(()=>{
                    return mockModerator
                }),
                getUsers :jest.fn(()=>{
                    return 1
                }),
                getLoggedInUsers: jest.fn(()=>{
                    return 3
                })
            }
        },
        {
          provide: getModelToken(Alert.name),
          useValue:{
            new: jest.fn().mockResolvedValue(mockAlert()),
            create: jest.fn().mockResolvedValue(mockAlert()),
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
        },
        {
            provide: getModelToken(MyScript.name), useValue:{
                distinct: jest.fn(()=>{
                    return 1
                }),
                length: jest.fn(()=>{
                    return 1
                }) 
            }
        },
        {
            provide: getModelToken(DownloadScript.name), useValue:{
                distinct: jest.fn(()=>{
                    return 2
                }),
                length: jest.fn(()=>{
                    return 2
                })
            }
        },
        {
            provide: getModelToken(Collection.name), useValue:{
                distinct: jest.fn(()=>{
                    return 1
                }),
                length: jest.fn(()=>{
                    return 1
                })  
            }
        },
        {
            provide: getModelToken(Moderator.name), useValue:{
                find: jest.fn(()=>{
                    return mockModerator
                }),
                save: jest.fn(()=>{
                    return mockModerator
                }),
                exists: jest.fn(()=>{
                    return true
                }),
                findById: jest.fn(()=>{
                    return mockModerator
                }),
                findByIdAndRemove: jest.fn(()=>{
                    return mockModerator
                })
            }
        },
        {
            provide: getModelToken(NeuralNetwork.name), useValue:{}
        },
        {
            provide: getModelToken(Ban.name), useValue:{
                findOne: jest.fn(()=>{
                    return mockBan
                }),
                save: jest.fn(()=>{
                    return mockBan
                }),
                exists: jest.fn(()=>{
                    return true
                }), 
                findOneAndRemove: jest.fn(()=>{
                    return mockBan
                }),
            }
        }
      ]
    }).compile();

    service = moduleRef.get<AdminService>(AdminService);
    automataModel = moduleRef.get<Model<AutomataScriptDocument>>(getModelToken(AutomataScript.name));
    myscriptModel = moduleRef.get<Model<MyScriptDocument>>(getModelToken(MyScript.name));
    downloadModel = moduleRef.get<Model<DownloadScriptDocument>>(getModelToken(DownloadScript.name));
    oldModel = moduleRef.get<Model<OldScriptDocument>>(getModelToken(OldScript.name));
    collectionModel = moduleRef.get<Model<CollectionDocument>>(getModelToken(Collection.name));
    moderatorModel = moduleRef.get<Model<ModeratorDocument>>(getModelToken(Moderator.name));
    networkModel = moduleRef.get<Model<NeuralNetworkDocument>>(getModelToken(NeuralNetwork.name));
    banModel = moduleRef.get<Model<BanDocument>>(getModelToken(Ban.name));
    alertService = moduleRef.get<AlertService>(AlertService);
    alertModel = moduleRef.get<Model<AlertDocument>>(getModelToken(Alert.name))

  });

  it('should be defined', ()=>{
    expect(service).toBeDefined();
    expect(automataModel).toBeDefined();
    expect(myscriptModel).toBeDefined();
    expect(downloadModel).toBeDefined();
    expect(oldModel).toBeDefined();
    expect(collectionModel).toBeDefined();
    expect(moderatorModel).toBeDefined();
    expect(networkModel).toBeDefined();
    expect(banModel).toBeDefined();
    expect(alertService).toBeDefined();
    expect(alertModel).toBeDefined();
  });

  afterEach(()=>{
    jest.clearAllMocks();
  });

  // describe('create', ()=>{
  //   it('should create admin', async()=>{
  //       const result = service.create("user1@gmail.com");
  //       if (result === null || undefined){
  //         expect(service.create("user1@gmail.com")).resolves.toEqual(null)

  //       }
  //       else{
  //         expect(service.create("user1@gmail.com")).resolves.toEqual(mockModerator)
  //       }
  //     });
  // });

  describe('ban', ()=>{
    it('should ban unauthorised user', async()=>{
        return service.ban(user1).then(result=>{
        if (result === null || result === undefined){
          expect(result).toBe(null);
        }else{
        expect(result).toBe(mockBan);
        }
      });
    });
  });

  describe('banned', ()=>{
    it('should check if the user is banned', async()=>{
        return service.banned(user1).then(result=>{
          expect(result).toBe(true)});
    });
  });

  // describe('unban', ()=>{
  //   it('should unban a user', async()=>{
  //       expect(service.unban("user1@gmail.com")).resolves.toEqual(mockBan)
  //   });
  // });

  // describe('warn', ()=>{
  //   it('should display a warning to the user', async()=>{
  //       expect(service.warn(user1,"This is a warning!!")).resolves.toBeDefined();
  //   });
  // });

  // describe('isAdmin', ()=>{
  //   it('should check if the user is admin user', async()=>{
  //       expect(service.isAdmin("user1@gmail.com")).resolves.toEqual(true);
  //   });
  // });

  // describe('setAdmin', ()=>{
  //   it('should set the user to admin', async()=>{
  //       expect(service.setAdmin("some ID", true)).resolves.toEqual(mockModerator)
  //   });
  // });

  // describe('getAll', ()=>{
  //   it('should get all admin users', async()=>{
  //       expect(service.getAll()).resolves.toEqual([mockModerator]);
  //   });
  // });

  // describe('remove', ()=>{
  //   it('should remove admin user', async()=>{
  //       expect(service.remove("some ID")).resolves.toEqual(mockModerator)
  //   });
  // });

  // describe('countDownloaders', ()=>{
  //   it('should count the number of downloads', async()=>{
  //       expect(service.countDownloaders()).resolves.toEqual(2);
  //   });
  // });

  // describe('countCollectionOwners', ()=>{
  //   it('should count the number of users who own Collections', async()=>{
  //       expect(service.countCollectionOwners()).resolves.toEqual(1);
  //   })
  // });

  // describe('countScriptAuthors',()=>{
  //   it('should count the number of script authors', async()=>{
  //       expect(service.countScriptAuthors()).resolves.toEqual(1)
  //   });
  // });

  // describe('getActiveAccounts',()=>{
  //   it('should get the number of active users', ()=>{
  //   expect(service.getActiveAccounts()).toEqual(1)
  //   });
  // });

  // describe('getLoggedInUsers',()=>{
  //   it('should get the number users logged in', ()=>{
  //   expect(service.getLoggedInUsers()).toEqual(3)
  //   });
  // });
      
  // describe('getTotalAccounts',()=>{
  //       it('should count the number of accounts', async()=>{
  //           expect(service.getTotalAccounts()).resolves.toEqual(4)
  //       });
  // });

  // describe('search', ()=>{
  //   it('should  search through the admin page', async()=>{
  //   const result = service.search("a term")
  //   expect(result).resolves.toEqual([userSearch]);
  // });
  // });
});