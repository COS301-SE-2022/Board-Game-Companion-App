import { Test, TestingModule } from '@nestjs/testing';
import { Model, Query } from 'mongoose';
import { getModelToken, InjectModel } from '@nestjs/mongoose';
import { Alert, AlertDocument } from '../../schemas/alert.schema';
import { user } from '../../models/general/user';
import { AutomataScript, AutomataScriptDocument } from '../../schemas/automata-script.schema';
import { OldScript, OldScriptDocument } from '../../schemas/old-script.schema';
import { AlertService } from './alert.service';

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


  const originalAlert = (
    recepient= {name:"user1", email:"user1@gmail.com"}, 
    date = new Date("20-02-15"),
    link = "www.link.com",
    alertType = 2,
    read = false,
  ): Alert => ({ recepient, date, link, alertType, read });

  const AlertDoc = [
    originalAlert(),
    originalAlert(user1, new Date("11-11-20"), "newLink",1, true ),
    originalAlert(user1,new Date("11-12-20"), "newLink2", 2, false ),
  ];

  const AlertDocMock = [
    mockAlert (),
    mockAlert ({recepient:user1, date: new Date("11-11-20"), link:"newLink", alertType:1, read: true}),
    mockAlert ({recepient:user1, date: new Date("11-12-20"), link:"newLink2", alertType:2, read: false})
  ];
  const mockScript = (
    name:"Script12", 
    author={name:"user1", email:"user1@gmail.com"},
    boardgame= "Monopoly",
    description= "This is monopoly script",
    version= {major: 2, minor:1, patch:3},
    size= 28,
    icon= {name:"iconFile", key:"iconKey", location:"iconLocation"},
    build= {name:"buildFile", key:"iconKey", location:"iconLocation"},
    models=["Model1", "Model2", "Model3"],
    iconSize= 8,//basescript 
    previous= ["Script11", "Script10"],
    link= "www.link.com", 
    dateReleased= new Date("13-02-16"),
    downloads=4, 
    lastDownload= new Date("20-02-15"),
    comments=[],
    rating =3, 
    source = {name:"sourceFile", key:"src123", location:"thisLcation"},
  ) : AutomataScript=>({name,author,boardgame,description,version,size,icon,build,models,iconSize,previous,link,dateReleased,downloads,lastDownload,export:true,comments,rating,source});

  const mockOld = (
    name:"Script6", 
    author={name:"user1", email:"user1@gmail.com"},
    boardgame= "Monopoly",
    description= "This is monopoly script",
    version= {major: 1, minor:1, patch:3},
    size= 28,
    icon= {name:"iconFile", key:"iconKey", location:"iconLocation"},
    build= {name:"buildFile", key:"iconKey", location:"iconLocation"},
    models=["Model1", "Model2"],
    iconSize= 8,//basescript 
    previous=[],
    dateReleased = new Date("05-02-10"),
    downloads=3,
    lastDownload =new Date("22-09-20"),
    comments=[], 
    rating=1,
    source={name:"oldsourceFile", key:"osrc123", location:"thisLcation"}
  ) : OldScript =>({name,author,boardgame,description,version,size,icon,build,models,iconSize,previous,dateReleased,downloads, lastDownload,export:true,comments,rating,source});
  
  
  beforeEach(async()=> {
    const moduleRef: TestingModule= await Test.createTestingModule({
      providers:[
        AlertService,
        {
          provide: getModelToken(Alert.name),
          useValue:{
            new: jest.fn().mockResolvedValue(mockAlert()),
            constructor: jest.fn().mockResolvedValue(mockAlert()),
            find: jest.fn(),
            findById: jest.fn(),
            exec: jest.fn(),
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
  });

  afterEach(()=>{
    jest.clearAllMocks();
  });

  describe('getAllUserMessages', ()=>{
  it('should return all alerts by user', async ()=>{
    expect.objectContaining(user1);
    const spy = jest.spyOn(service,'getAllUserMessages');
    const doc : AlertDocument[] = [];
    jest.spyOn(service,'getAllUserMessages').mockResolvedValue(doc);
    expect(spy).toHaveBeenCalled
    expect(await service.getAllUserMessages({name:"",email:""})).toEqual(doc)
    });
  });

  describe('getAllUnReadUserMessages', ()=>{
    it('should return all unread messages by user', async ()=>{
      expect.objectContaining(user1);
      const spy = jest.spyOn(service,'getAllUnReadUserMessages');
      const doc : AlertDocument[] = [];
      jest.spyOn(service,'getAllUnReadUserMessages').mockResolvedValue(doc);
      expect(spy).toHaveBeenCalled
      expect(await service.getAllUnReadUserMessages({name:"",email:""})).toEqual(doc)
      });
    })
  
})