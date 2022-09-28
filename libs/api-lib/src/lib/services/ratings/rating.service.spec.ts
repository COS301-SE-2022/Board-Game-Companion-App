import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import { user } from '../../models/general/user';
import { AutomataScript, AutomataScriptDocument } from '../../schemas/automata-script.schema';
import { OldScript, OldScriptDocument } from '../../schemas/old-script.schema';
import { Rating, RatingDocument} from '../../schemas/rating.schema';
import { RatingService } from '../../services/ratings/rating.service';

describe('RatingService', () => {
  let service: RatingService;
  let ratingModel: Model<RatingDocument>;
  let automataModel: Model<AutomataScriptDocument>; 
  let oldModel: Model<OldScriptDocument>; 

  const mockRepository = {
    find() {
      return {}
      ;
    }
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RatingService,    
        {
        provide: getModelToken(Rating.name),
        useValue:{
          findOne: jest.fn(),
          countDocuments: jest.fn(),
          aggregate: jest.fn(),
        }
      },{
        provide: getModelToken(AutomataScript.name),
        useValue:{
          findById: jest.fn(),
        }
      },{
        provide: getModelToken(OldScript.name),
        useValue:{
          findById: jest.fn(),
        }
      }],
    }).compile();

    service = module.get<RatingService>(RatingService);
    ratingModel = module.get<Model<RatingDocument>>(getModelToken(Rating.name));
    automataModel =module.get<Model<AutomataScriptDocument>>(getModelToken(AutomataScript.name)); 
    oldModel= module.get<Model<OldScriptDocument>>(getModelToken(OldScript.name));

  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(ratingModel).toBeDefined();
    expect(automataModel).toBeDefined();
    expect(oldModel).toBeDefined();
  });
});

/************************************intergration test*********************************************/
describe('RatingService', ()=>{
  let service2: RatingService;
  let automataModel2: Model<AutomataScriptDocument>;
  let oldModel2: Model<OldScriptDocument>;
  let ratingModel2: Model<RatingDocument>;
  // let Dom ;
  beforeEach(async () => {
    // Dom = new DomManipulation()
    const module2: TestingModule = await Test.createTestingModule({
      //imports:[MongooseModule.forRoot(process.env.PROJECT_STATUS == "development" ? process.env.MONGO_URI_DEV : process.env.MONGO_URI_PROD)],
      providers: [RatingService, 
      { 
        provide: getModelToken(Rating.name),
        useValue: {}
      }, 
      {
        provide: getModelToken(AutomataScript.name),
        useValue:{}
      }, 
      {
        provide: getModelToken(OldScript.name),
        useValue:{}
      }]
    }).compile();

    service2 = module2.get<RatingService>(RatingService); 
    automataModel2= module2.get<Model<AutomataScriptDocument>>(getModelToken(AutomataScript.name));
    oldModel2= module2.get<Model<OldScriptDocument>>(getModelToken(OldScript.name));
    ratingModel2= module2.get<Model<RatingDocument>>(getModelToken(Rating.name));
  });

  it('return the rating of the sript', async()=>{
    const result = jest.spyOn(service2, 'rate');
    //await authenticationService.getRating('user@email.com', 'strongPassword');
    expect(result).toBeDefined();
    const thisUser : user = {
      name: "Nasiphi",
      email: "nasiphi@gmail.com"
    }
    //const findThat = jest.spyOn(ratingModel2, 'findOne');
    await service2.getRating(thisUser, "myScript"); //call function
    expect(ratingModel2.findOne<Rating>)

  });
});