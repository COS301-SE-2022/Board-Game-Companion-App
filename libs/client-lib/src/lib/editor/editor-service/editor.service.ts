import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class EditorService {
  private url = "";
  constructor(private readonly httpClient:HttpClient) {
    this.url = "http://localhost:3333/api/script-editor"
  }

  //:Observable<any>
  postScript(id:string, fname:string, content:any):Observable<any>{
    console.log(fname);
    return this.httpClient.post(this.url+'/upload',{id:id, filename:fname, content:content});
  }

  getScript(id:string, filename:string){
    return this.httpClient.get(this.url+'/content',{params:{id:id, filename:filename}});
  }

  
}
