import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Comment } from '../../schemas/comment.schema';
import { Like } from '../../schemas/like.schema';
import { ModelsService } from '../models/models.service';

describe('CommentService', () => {
   let service: ModelsService;

   const mockRepository = {
     find() {
       return {};
     }
   };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ModelsService,   { 
          provide: getModelToken(Comment.name),
          useValue: mockRepository
      },  { 
        provide: getModelToken(Like.name),
        useValue: mockRepository
    }],
    }).compile();

    service = module.get<ModelsService>(ModelsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
