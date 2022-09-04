import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { comment } from '../../models/comments/comment';
import { like } from '../../models/comments/like';
import { commentCount } from '../../models/comments/commentCount';
import { user } from '../../models/general/user';


@Injectable()
export class CommentService {
  private api = "";

  constructor(private readonly httpClient:HttpClient) { 
    this.api = "http://localhost:3333/api/";
  }

  countComments(id:string):Observable<number>{
    let param = new HttpParams();
    param = param.set("id",id);
    console.log("countComments");
    return this.httpClient.get<number>(this.api + "comments/count-comments",{params:param});
  }

  saveComment(formData:FormData):Observable<comment>{
    const data = {
      userName: formData.get("userName"),
      userEmail: formData.get("userEmail"),
      image: formData.get("image"),
      content: formData.get("content"),
      script: formData.get("script")
    }
    return this.httpClient.post<comment>(this.api + "comments/create-comment",data);
  }

  getComments(commentsId:string[]):Observable<comment[]>{
    let param = new HttpParams();
    param = param.set("commentsId",JSON.stringify(commentsId));

    return this.httpClient.get<comment[]>(this.api + "comments/retrieve-all",{params:param});
  }

  addReply(commentId:string,replyId:string): Observable<any>{
    return this.httpClient.put(this.api + "comments/add-reply",{commentId:commentId,replyId:replyId});
  }

  like(comment:string,user:user,like:boolean): Observable<like>{
    return this.httpClient.post<like>(this.api + "comments/like",{comment:comment,user:user,like:like});
  }

  countlikes(comment:string):Observable<commentCount>{
    let param = new HttpParams();
    param = param.set("comment",comment);

    return this.httpClient.get<commentCount>(this.api + "comments/count-likes",{params:param});
  }

  getLike(comment:string,user:user):Observable<like>{
    let param = new HttpParams();
    param = param.set("comment",comment);
    param = param.set("userName",user.name);    
    param = param.set("userName",user.email);

    return this.httpClient.get<like>(this.api + "comments/retrieve-like",{params:param});
  }

  removeLike(id:string){
    let param = new HttpParams();
    param = param.set("id",id);

    return this.httpClient.delete(this.api + "comments/remove-like",{params:param}).subscribe();
  }
}
