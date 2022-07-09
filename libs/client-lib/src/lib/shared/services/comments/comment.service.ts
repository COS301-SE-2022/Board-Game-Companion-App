import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { comment } from '../../models/comment';


@Injectable()
export class CommentService {
  private api = "";

  constructor(private readonly httpClient:HttpClient) { 
    this.api = "http://localhost:3333/api/";
  }

  countComments(id:string):Observable<number>{
    let param = new HttpParams();
    param = param.set("id",id);

    return this.httpClient.get<number>(this.api + "comments/count-comments",{params:param});
  }

  saveComment(formData:FormData):Observable<comment>{
    const data = {
      name: formData.get("name"),
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

  addReply(commentId:string,replyId:string): void{
    this.httpClient.put(this.api + "comments/add-reply",{commentId:commentId,replyId:replyId}).subscribe();
  }
}
