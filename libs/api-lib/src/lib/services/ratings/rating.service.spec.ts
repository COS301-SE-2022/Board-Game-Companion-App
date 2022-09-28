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

  const user1: user={
    name: "user1", 
    email: "user1@gmail,com"
  }

  const myRating: Rating ={
    user: user1,
    script: "script12",
    value: 2,
  }
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

  describe('rate', ()=>{
    it('should rate the script', async()=>{
        expect(service.rate(user1, "scrip12", 2)).resolves.toEqual(myRating)
    });
  });

  describe('getRating', ()=>{
    it('should get rating of the script', async()=>{
        expect(service.getRating(user1, "scrip12")).resolves.toEqual(myRating)
    });
  });
  
  describe('average', ()=>{
    it('should show the average rating', async()=>{
        expect(service.average("scrip12")).resolves.toEqual(88)
    });
  });

  describe('countRating', ()=>{
    it('should count the rating', async()=>{
        expect(service.countRating("scrip12")).resolves.toEqual(12)
    });
  });
});