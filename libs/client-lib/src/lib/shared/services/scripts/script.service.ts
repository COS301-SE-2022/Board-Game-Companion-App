import { Injectable, NgModule } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { script } from '../../models/script';


@Injectable()
export class ScriptService {
  private url = "";
  private api = "";

  constructor(private readonly httpClient:HttpClient) { 
    this.url = "https://api.geekdo.com/xmlapi2/"
    this.api = "http://localhost:3333/api/";
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

  saveScript(formData:FormData):Observable<script>{
    return this.httpClient.post<script>(this.api + "scripts/create-script",formData);
  }

  retrieveAllScript():Observable<script[]>{
    return this.httpClient.get<script[]>(this.api + "scripts/retrieve/all");
  }
}
