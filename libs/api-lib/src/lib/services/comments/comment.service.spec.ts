import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import { commentDto } from '../../models/dto/commentDto';
import { alertType } from '../../models/general/alertType';
import { user } from '../../models/general/user';
import { Alert, AlertDocument } from '../../schemas/alert.schema';
import { AutomataScript, AutomataScriptDocument } from '../../schemas/automata-script.schema';
import { Comment, CommentDocument } from '../../schemas/comment.schema';
import { Like, LikeDocument } from '../../schemas/like.schema';
import { OldScript, OldScriptDocument } from '../../schemas/old-script.schema';
import { AlertService } from '../alert/alert.service';
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
  

  const mockRepository = {
    find() {
      return {};
    }
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CommentService, AlertService, 
        { 
          provide: getModelToken(AutomataScript.name),
          useValue: mockRepository
      },  
      { 
        provide: getModelToken(Like.name),
        useValue: mockRepository
    },
    {
      provide: getModelToken(OldScript.name),
      useValue: mockRepository
    },
    {
      provide: getModelToken(Alert.name),
      useValue: mockRepository
    },
    {
      provide: getModelToken(Comment.name),
      useValue: mockRepository
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

  const newUser : user ={
    name: "user",
    email: "user@gmail.com"
  }
  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(likeModel).toBeDefined();
    expect(autoMataModel).toBeDefined();
    expect(oldModel).toBeDefined();
    expect(alertModel).toBeDefined();
    expect(alertService).toBeDefined();
    expect(commentModel).toBeDefined();
  });

  it('should create a comment', async ()=>{
    expect(service.createComment(newUser,"image","script","content")).resolves.toEqual({
      user: newUser, 
        image: "image", 
        created: new Date("25-12-19"),
        script:"script", 
        content:"content",
        replies:[],
    })
  });

  it('should get comments',()=>{
    jest.spyOn(service,'getComments').mockImplementation((commentsId:string[])=>
      Promise.resolve([{
        user: newUser, 
        image: "image", 
        created: new Date("25-12-19"),
        script:"script", 
        content:"content",
        replies:[],
      }])
    )
  });

  it('should like comment',()=>{
    jest.spyOn(service,'like').mockImplementation((comment:string,user:user,like:boolean)=>
    Promise.resolve({
      comment:comment,
      user: user,
      like:like,
    }));
  });

  it('should get like', ()=>{
    jest.spyOn(service,'getLike').mockImplementation((comment:string,user:user)=>
      Promise.resolve({
        comment:comment,
        user:user,
        like:false
      })
    );
  });

  it('should count the number of comments', ()=>{
    jest.spyOn(service,'count').mockImplementation(()=>
      Promise.resolve({
        likes: 0,
        dislikes: 0,
        replies: 0,
      }));
  });


});
