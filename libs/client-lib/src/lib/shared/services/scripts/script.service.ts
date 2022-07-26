import { Injectable, NgModule } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { script } from '../../models/script';
import { rating } from '../../models/rating';


@Injectable()
export class ScriptService {
  private url = "";
  private api = "";

  constructor(private readonly httpClient:HttpClient) { 
    this.url = "https://api.geekdo.com/xmlapi2/"
    this.api = "http://localhost:3333/api/";
    //this.api = "https://board-game-companion-app-api.herokuapp.com/api/"
  }
 
  // createScript(name:string,boardgame:string,files:string[])

  getApiUrl():string{
    return this.api;
  }

  getBbgUrl():string{
    return this.url;
  }

  getBoardGameByName(name:string,exact:boolean):Observable<any>{

    return this.httpClient.get(this.url + "search?query="+name+"&type=boardgame" + (exact ? "&exact=1":""),{responseType: 'text'})
  }

  getScriptById(id:string):Observable<script>{
    let param = new HttpParams();
    param = param.set("id",id);

    return this.httpClient.get<script>(this.api + "scripts/retrieve/byid",{params:param});
  }

  saveScript(formData:FormData):Observable<script>{
    return this.httpClient.post<script>(this.api + "scripts/create-script",formData);
  }

  getAllMyScripts(owner:string):Observable<script[]>{
    let param = new HttpParams();
    param = param.set("owner",owner);

    return this.httpClient.get<script[]>(this.api + "scripts/retrieve/byowner",{params:param});
  }

  addComment(scriptId:string,commentId:string):void{
    this.httpClient.put(this.api + "scripts/add-comment",{scriptId:scriptId,commentId:commentId}).subscribe();
  }

  removeScript(id:string):Observable<void>{
    return this.httpClient.delete<void>(this.api + "scripts/remove/" + id);
  }

  updateScriptInfo(data:any):Observable<script>{
    return this.httpClient.post<script>(this.api + "scripts/update",data);
  }

  updateStatus(id:string,value:number,message:string):Observable<script>{
    return this.httpClient.put<script>(this.api + "scripts/update/status",{id:id,value:value,message:message});
  }

  retrieveAllScript():Observable<script[]>{
    return this.httpClient.get<script[]>(this.api + "scripts/retrieve/all");
  }

  getFileData(file:string):Observable<any>{
    return this.httpClient.get(file,{responseType:'text'});
  }

  updateFile(id:string,content:string):Observable<{status:string,message:string}>{
    return this.httpClient.put<{status:string,message:string}>(this.api + "scripts/update-file",{id:id,name:name,content:content});
  }

  rate(user:string,script:string,value:number):Observable<rating>{
    return this.httpClient.post<rating>(this.api + "scripts/rate",{user:user,script:script,value:value});
  }

  getRating(user:string,script:string):Observable<rating>{
    let param = new HttpParams();
    param = param.set("user",user);
    param = param.set("script",script);
    
    return this.httpClient.get<rating>(this.api + "scripts/retrieve-rating",{params:param});
  }

  countRating(script:string):Observable<number>{
    let param = new HttpParams();
    param = param.set("script",script);

    return this.httpClient.get<number>(this.api + "scripts/count-rating",{params:param});
  }

  averageRating(script:string):Observable<number>{
    let param = new HttpParams();
    param = param.set("script",script);

    return this.httpClient.get<number>(this.api + "scripts/average-rating",{params:param});
  }


}
