import { Injectable, NgModule } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { script } from '../../models/scripts/script';
import { rating } from '../../models/scripts/rating';
import { user } from '../../models/general/user';
import { User } from 'aws-sdk/clients/budgets';
import { entity } from '../../models/editor/entity';
import { myScript } from '../../models/scripts/my-script';
import { version } from '../../models/scripts/version';
import { transpilationResponse } from '../../models/editor/transpilationResponse';

@Injectable()
export class EditorService {
  private api = "";

  constructor(private readonly httpClient:HttpClient) { 
    // this.api = environmen;
    this.api = "https://board-game-companion-app.herokuapp.com/api/";
    //this.api = "http://localhost:3333/api/"
  }

  getFileData(file:string):Observable<any>{
    return this.httpClient.get(file,{responseType:'text'});
  }

  updateFile(id:string,content:string):Observable<transpilationResponse>{
    return this.httpClient.put<transpilationResponse>(this.api + "editor/update-file",{id:id,content:content});
  }

  updateScriptModels(script:string,networks:string[]):Observable<myScript>{
    return this.httpClient.put<myScript>(this.api + "editor/update-models",{script:script,networks:networks});
  }
}
