import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import e = require('express');
import { Model } from 'mongoose';
import { commentDto } from '../../models/dto/commentDto';
import { alertType } from '../../models/general/alertType';
import { commentCount } from '../../models/general/commentCount';
import { user } from '../../models/general/user';
import { Alert, AlertDocument } from '../../schemas/alert.schema';
import { AutomataScript, AutomataScriptDocument } from '../../schemas/automata-script.schema';
import { Comment, CommentDocument } from '../../schemas/comment.schema';
import { Like, LikeDocument } from '../../schemas/like.schema';
import { OldScript, OldScriptDocument } from '../../schemas/old-script.schema';
import { AlertService } from '../alert/alert.service';
import { SocketGateway } from '../socket/socket.gateway';
import { CommentService } from './comment.service';

/*************************************************unit test**********************************************/

describe('CommentService', () => {
  let service: CommentService;
  let likeModel: Model<LikeDocument>;
  let autoMataModel: Model<AutomataScriptDocument>;
  let oldModel: Model<OldScriptDocument>;
  let alertService: AlertService;
  let alertModel: Model<AlertDocument>;
  let commentModel: Model<CommentDocument>;

  const newUser : user ={
    name: "user",
    email: "user@gmail.com"
  }
  
  const newAlert = (mock?: Partial<Alert>): Partial<AlertDocument> => ({
    recepient: newUser,
    date: new Date("01-03-19"),
    link: "www.AlertLink.com",
    alertType: 3,
    read: true,
  }); 

  const newComment : Comment ={
    user: newUser, 
    image: "coolimage.png",
    created: new Date("01-02-16"),
    script: "Script12", 
    content: "soome content",
    replies: []
  }

  const countComments : commentCount ={
    likes: 2,
    dislikes: 0,
    replies: 3
  }

  const newLike: Like ={
    comment: "some ID", 
    user: newUser, 
    like: true
  }

  const mockRepository = {
    find() {
      return {};
    }
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CommentService, AlertService, SocketGateway,
        { 
          provide: getModelToken(AutomataScript.name),
          useValue: {
            findById: jest.fn()
          }
      },  
      { 
        provide: getModelToken(Like.name),
        useValue: mockRepository
    },
    {
      provide: getModelToken(OldScript.name),
      useValue: {
        findById: jest.fn()
      }
    },
    {
      provide: getModelToken(Alert.name),
      useValue: mockRepository
    },
    {
      provide: getModelToken(Comment.name),
      useValue: {
        find: jest.fn(), 
        countDocuments: jest.fn(),
        findById: jest.fn(),
        save: jest.fn(),
      }
    }
  ],
    }).compile();

    service = module.get<CommentService>(CommentService);
    likeModel= module.get<Model<LikeDocument>>(getModelToken(Like.name));
    autoMataModel= module.get<Model<AutomataScriptDocument>>(getModelToken(AutomataScript.name));
    oldModel= module.get<Model<OldScriptDocument>>(getModelToken(OldScript.name));
    alertModel= module.get<Model<AlertDocument>>(getModelToken(Alert.name));
    alertService=module.get<AlertService>(AlertService);
    commentModel= module.get<Model<CommentDocument>>(getModelToken(Comment.name));
  }); 

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(likeModel).toBeDefined();
    expect(autoMataModel).toBeDefined();
    expect(oldModel).toBeDefined();
    expect(alertModel).toBeDefined();
    expect(alertService).toBeDefined();
    expect(commentModel).toBeDefined();
  });

  describe('alertComment', ()=>{
    it('shouls show alert comments', async()=>{
      await expect(service.alertComment(newComment)).toBeDefined();
    });
  });

  // describe('createComment', ()=>{
  //   it('should create a comment', async()=>{
  //     expect(await service.createComment(newUser, "coolimage.png","Script12","soome content")).toEqual(newComment);
  //   });
  // });

  // describe('alertReply', ()=>{
  //   it('should alert a reply', async()=>{
  //     expect(await service.alertReply("some ID", "another ID")).toBeDefined()
  //   });
  // }); 

  // describe('countComments', ()=>{
  //   it('should count the number comments', async()=>{
  //     expect(await service.countComments("some ID")).toEqual(3)
  //   });
  // });

  // describe('getComments', ()=>{
  //   it('should get all comments', async()=>{
  //     expect(await service.getComments(["some ID"])).toEqual([newComment])
  //   });
  // });

  // describe('addReply', ()=>{
  //   it('should add a reply', async()=>{
  //     expect(service.addReply("some ID", "another ID")).resolves.toBeDefined();
  //   });
  // });

  // describe('like', ()=>{
  //   it('should like comment', async()=>{
  //     expect(service.like("some ID", newUser, true)).resolves.toEqual(newLike);
  //   });
  // });

  // describe('getLike', ()=>{
  //   it('should get likes on a specific comment', async()=>{
  //     expect(service.getLike("some ID", newUser)).resolves.toEqual(newLike);
  //   });
  // });

  // describe('removeLike', ()=>{
  //   it('should remove like on comment', async()=>{
  //     expect(service.removeLike("some ID")).resolves.toBeDefined();
  //   });
  // });

  // describe('count', ()=>{
  //   it('should count the number of comments', async()=>{
  //     expect(service.count("some ID")).resolves.toEqual(countComments)
  //   });
  // });
});
