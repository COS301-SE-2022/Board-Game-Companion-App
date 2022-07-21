import { TestBed } from '@angular/core/testing';

import { comment } from '../../models/comment';
import { like } from '../../models/like';
import { likeCount } from '../../models/likeCount';

import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CommentService } from './comment.service';


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
  formData.append('name','NN');
  formData.append('image','img.jpg');
  formData.append('content','This script is working');
  formData.append('script','');

  const exComment: comment = {
    _id: '6',
    name: 'NN',
    image: 'img.jpg',
    created: new Date(0),
    script: '',
    content: 'This script is working',
    replies: [] 
  };

  it('should saveComment and resturn it',()=>{
    service.saveComment(formData).subscribe((data)=>{
      expect(data).toEqual(exComment);
    });
    const req = httpTestingController.expectOne('http://localhost:3333/api/comments/create-comment');
    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual({name:'NN',image:'img.jpg',content:'This script is working',script:''});

    req.flush(exComment);
  });

  it('should add a Reply',()=>{
    service.addReply('5','Sure awesome');
    const req = httpTestingController.expectOne('http://localhost:3333/api/comments/add-reply');
    expect(req.request.method).toEqual('PUT');
    expect(req.request.body).toEqual({commentId:'5',replyId:'Sure awesome'});
  });
  const exLike: like={
    _id:'5',
    comment:'Oh! great awesome',
    user:'NN',
    like:'true'
  }
  it('should add like and return like object',()=>{
    service.like('Oh! great awesome','ZM',true).subscribe((data)=>{
      expect(data).toEqual(exLike);
    });

    const req = httpTestingController.expectOne('http://localhost:3333/api/comments/like');
    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual({comment:'Oh! great awesome',user:'ZM',like:true});

    req.flush(exLike);
  });

  const exCountlikes: likeCount={
    likes: 12,
    dislikes: 2
  };

  it('should return count of likes given a comment',()=>{
    service.countlikes('Dope script you have there.').subscribe((data)=>{
      expect(data).not.toBe(null);
      expect(data).toEqual(exCountlikes);
    });
    const req = httpTestingController.expectOne('http://localhost:3333/api/comments/count-likes?comment=Dope%20script%20you%20have%20there.');
    expect(req.request.method).toEqual('GET');
    
    req.flush(exCountlikes);
  });

  it('should get like by comment and user',()=>{
    service.getLike('Done and tested','NN').subscribe((data)=>{
      expect(data).not.toBe(null);
      expect(data).toEqual(exLike);
    });
    const req = httpTestingController.expectOne('http://localhost:3333/api/comments/retrieve-like');
    expect(req.request.method).toEqual('GET');

    req.flush(exLike);
  });

  it('should delete/remove a like',()=>{
    service.removeLike('12345');
    
    const req = httpTestingController.expectOne('http://localhost:3333/api/comments/remove-like?id=12345');
    expect(req.request.method).toBe('DELETE');
  });

});
