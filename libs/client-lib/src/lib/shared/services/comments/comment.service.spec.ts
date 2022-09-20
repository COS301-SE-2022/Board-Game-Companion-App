import { TestBed } from '@angular/core/testing';
import { comment } from '../../models/comments/comment';
import { like } from '../../models/comments/like';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CommentService } from './comment.service';
import { commentCount } from '../../models/comments/commentCount';
// import { tNull } from 'libs/api-lib/src/lib/models/general/tokens';


describe('Test script service',()=>{
  let service: CommentService;
  let httpTestingController: HttpTestingController;

  beforeEach(()=>{
    TestBed.configureTestingModule({imports:[HttpClientTestingModule],providers:[CommentService]});
    service = TestBed.inject(CommentService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(()=>{
    httpTestingController.verify();
  });

  it('should create service',()=>{
    expect(service).toBeTruthy();
  });

  it('should return number of comments',()=>{
    service.countComments('12345').subscribe((data)=>{
      expect(data).toBe(5);
    });
    const req = httpTestingController.expectOne('http://localhost:3333/api/comments/count-comments?id=12345');
    expect(req.request.method).toBe('GET');
    req.flush(5);
  });

  const formData = new FormData();
  formData.append('userName','NN');
  formData.append('userEmail','Arha@gmail.com');
  formData.append('image','image.jpg');
  formData.append('content','saved ');
  formData.append('script','fighter script');

  const exComment: comment = {
    _id: '6',
    user: {name:'NN',email:'njab.com'},
    image: 'img.jpg',
    created: new Date(0),
    script: '',
    content: 'This script is working',
    replies: [] 
  };

  it('should saveComment and return it',()=>{
    service.saveComment(formData).subscribe((data)=>{
      expect(data).toEqual(exComment);
    });
    const req = httpTestingController.expectOne('http://localhost:3333/api/comments/create-comment');
    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual({userName:'NN',userEmail:'Arha@gmail.com',script:'fighter script',image:'image.jpg',content:'saved '});

    req.flush(exComment);
  });

  it('should add a Reply',()=>{
    service.addReply('5','Sure awesome').subscribe((data)=>{
      expect(data).toBe({message:'reply added'});
    });
    const req = httpTestingController.expectOne('http://localhost:3333/api/comments/add-reply');
    expect(req.request.method).toEqual('PUT');
    expect(req.request.body).toEqual({commentId:'5',replyId:'Sure awesome'});

    req.flush({message:'reply added'});
  });
  const exLike: like={
    _id:'5',
    comment:'Oh! great awesome',
    user:{name:'NN',email:'njab.com'},
    like:true
  }
  it('should add like and return like object',()=>{
    service.like('Oh! great awesome',true).subscribe((data)=>{
      expect(data).toEqual(exLike);
    });

    const req = httpTestingController.expectOne('http://localhost:3333/api/comments/like');
    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual({comment:'Oh! great awesome',like:true,user:{email:null,name:null}});

    req.flush(exLike);
  });

  const exCountComments: commentCount={
    likes: 5,
    dislikes: 4,
    replies: 10,
  };

  it('should return count of likes given a comment',()=>{
    service.countlikes('Dope script you have there.').subscribe((data)=>{
      expect(data).not.toBe(null);
      expect(data).toEqual(exCountComments);
    });
    const req = httpTestingController.expectOne('http://localhost:3333/api/comments/count-likes?comment=Dope%20script%20you%20have%20there.');
    expect(req.request.method).toEqual('GET');
    
    req.flush(exCountComments);
  });

  it('should get like by comment and user',()=>{
    service.getLike('Done and tested',{name:'NN',email:'njab.com'}).subscribe((data)=>{
      expect(data).not.toBe(null);
      expect(data).toEqual(exLike);
    });
    const req = httpTestingController.expectOne('http://localhost:3333/api/comments/retrieve-like?comment=Done%20and%20tested&userName=njab.com');
    expect(req.request.method).toEqual('GET');

    req.flush(exLike);
  });

  it('should delete/remove a like',()=>{
    service.removeLike('12345');
    
    const req = httpTestingController.expectOne('http://localhost:3333/api/comments/remove-like?id=12345');
    expect(req.request.method).toBe('DELETE');
  });

});
