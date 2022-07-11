import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Comment } from '../../schemas/comment.schema';
import { Like } from '../../schemas/like.schema';
import { CommentService } from './comment.service';

describe('CommentService', () => {
  let service: CommentService;

  const mockRepository = {
    find() {
      return {};
    }
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CommentService,   { 
          provide: getModelToken(Comment.name),
          useValue: mockRepository
      },  { 
        provide: getModelToken(Like.name),
        useValue: mockRepository
    }],
    }).compile();

    service = module.get<CommentService>(CommentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
