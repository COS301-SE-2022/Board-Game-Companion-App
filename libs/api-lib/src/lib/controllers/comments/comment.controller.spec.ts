import { Test, TestingModule } from "@nestjs/testing";
import { user } from '../../models/general/user';
import { CommentService } from '../../services/comments/comment.service';
import { ApiCommentController } from "../comments/comment.controller";
import { version } from "../../models/general/version";
import { Like, LikeDocument } from '../../schemas/like.schema';


jest.mock('../../services/comments/comment.service');
/***************************************************Unit Test***********************************************/
describe('ApiCommentController', ()=>{
  let controller : ApiCommentController;
  let service : CommentService; 

  beforeEach(async () => {
    const moduleRef : TestingModule = await Test.createTestingModule({
      controllers: [ApiCommentController], 
      providers:[{
        provide:CommentService, useValue:{
          createComment: jest.fn().mockImplementation((user:user,image:string,script:string,content:string)=>
            Promise.resolve({
              user: user,
              image: image, 
              created: new Date("13-02-18"), 
              script: script, 
              content: content, 
              replies: [],
            }),
          ),
          //alertComment: jest.fn().mockImplementation(),
          //alertReply: jest.fn().mockImplementation(),
          countComments: jest.fn().mockImplementation((id:string)=>
          Promise.resolve(5)),
          getComments: jest.fn().mockImplementation((commentsId:string)=>{
            Promise.resolve([
              {
                user:{name:commentsId, email:"user1@gmail.com"},
                image:"board1.png",
                created: new Date("30-05-20"),
                script: "Board1Script",
                content: "This is board game 1 comment",
                replies: []
              },
              {
                user:{name:commentsId, email:"user1@gmail.com"},
                image:"board2.png",
                created: new Date("10-08-20"),
                script: "Board2Script",
                content: "This is board game 2 comment",
                replies: []
              },
              {
                user:{name:commentsId, email:"user1@gmail.com"},
                image:"board3.png",
                created: new Date("15-01-21"),
                script: "Board3Script",
                content: "This is board game 3 comment",
                replies: []
              },
            ]);
          }),
          addReply: jest.fn().mockImplementation((commentId:string,replyId:string) =>{
            Promise.resolve({
              user: {new:commentId, email:"cocochanel@gmail.com"},
              image: "boardgame33.png",
              created: new Date("17-06-18"),
              script: "boardgame33Script",
              content: "Wow this is so cool", 
              replies: [{replyId, ref:'Comment'}]
            });
          }),
          like: jest.fn().mockImplementation((comment:string,user:user,like:boolean) =>{
             Promise.resolve({
              comment: comment, 
              user:user,
              like: true,
            });

          }),
          getLike: jest.fn().mockImplementation((comment:string,user:user) => {
            Promise.resolve({
              comment: comment,
              user: user,
              like: true 
            });
          }),
          removeLike: jest.fn().mockImplementation((id:string) =>{
            Promise.reject({
              comment :id,
              user:{name:"Sandy", email:"SandyBraxton@gmail.com"},
              like:true
            });
          }),
          count: jest.fn().mockImplementation((comment:string)=>{
            Promise.resolve({
              likes: 7,
              dislikes: 1,
              replies: 3
            });
          })
        }}
      ]
    }).compile();

    service = moduleRef.get<CommentService>(CommentService);
    controller = moduleRef.get<ApiCommentController>(ApiCommentController);
  });

  it('should be defined', ()=>{
    expect(ApiCommentController).toBeDefined();
  });

  describe('createComment', ()=>{
    it('should create a comment', ()=>{
      expect(controller.createComment("Jack","Jack&Jill@gmail.com", "gameboard.png", "Script4","I love this game")).resolves.toEqual(
        [{
          user: {name: "Jack", email:"Jack&Jill@gmail.com"},
          image: "gameboard.png", 
          created: new Date("13-02-18"),
          script: "Script4", 
          content: "I love this game", 
          replies: []
        }]
      );
    });
  });

  describe('countComments', ()=>{
    it('should count the total number of comments', ()=>{
      expect(controller.countComments("Game3")).resolves.toEqual(5)
    });
  });

  describe('getComments', ()=>{
    it('should get all comments of script', ()=>{
      expect(controller.getComments("comment15")).resolves.toEqual([
        {
          user:{name:"comment15", email:"user1@gmail.com"},
          image:"board1.png",
          created: new Date("30-05-20"),
          script: "Board1Script",
          content: "This is board game 1 comment",
          replies: []
        },
        {
          user:{name:"comment15", email:"user1@gmail.com"},
          image:"board2.png",
          created: new Date("10-08-20"),
          script: "Board2Script",
          content: "This is board game 2 comment",
          replies: []
        },
        {
          user:{name:"comment15", email:"user1@gmail.com"},
          image:"board3.png",
          created: new Date("15-01-21"),
          script: "Board3Script",
          content: "This is board game 3 comment",
          replies: []
        },
      ]);
    });
  });

  describe('addReply', ()=>{
    it('should add a reply to a comment', ()=>{
      expect(controller.addReply("comment1818", "reply1818")).resolves.toEqual({
        user: {new:"comment1818", email:"cocochanel@gmail.com"},
        image: "boardgame33.png",
        created: new Date("17-06-18"),
        script: "boardgame33Script",
        content: "Wow this is so cool", 
        replies: [{type:"reply1818", ref:'Comment'}]
      });
    });
  });

  describe('likeComment', ()=>{
    it('should like a comment',()=>{
      const thisUser : user ={
        name:"Angie",
        email:"AngieGovender@gmail.com"
      }
      expect(controller.likeComment("This is my comment",thisUser,true)).resolves.toEqual({
          comment:"This is my comment", 
          user: thisUser,
          like: true,
      });
    });
  });

  describe('countLikes', ()=>{
    it('should display number of likes', ()=>{
      expect(controller.countLikes("This is a comment")).resolves.toEqual({
        likes: 7,
        dislikes: 1,
        replies: 3
      });
    });
  });

  describe('removeLike', ()=>{
    it('should remove this like', ()=>{
      expect(controller.removeLike("someID")).rejects.toEqual({
        comment :"someID",
        user:{name:"Sandy", email:"SandyBraxton@gmail.com"},
        like:true
      });
    });
  });

  describe('getLike', ()=>{
    it('should get likes of user', ()=>{
      const newUser: user ={
        name: "Jade",
        email: "JadeJacobs@gmail.com"
      }
      expect(controller.getLike("Thiscomment",newUser.name, newUser.email)).resolves.toEqual({
        comment: "Thiscomment",
        user: newUser,
        like:true
      });
    });
  });



});