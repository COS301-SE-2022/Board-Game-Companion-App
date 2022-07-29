import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Rating} from '../../schemas/rating.schema';
import { RatingService } from './rating.service';

describe('RatingService', () => {
  let service: RatingService;
  const mockRepository = {
    find() {
      return {};
    }
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RatingService,    {
        provide: getModelToken(Rating.name),
        useValue: mockRepository
      }],
    }).compile();

    service = module.get<RatingService>(RatingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
