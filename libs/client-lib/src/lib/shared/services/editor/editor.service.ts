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
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { environment } from '../../../../../../../apps/client/src/environments/environment';

@Injectable()
export class EditorService {
  private api = "";

  constructor(private readonly httpClient:HttpClient) { 
    this.api = environment.baseUrl;
    //this.api = "https://board-game-companion-app-api.herokuapp.com/api/"
  }

  getFileData(file:string):Observable<any>{
    return this.httpClient.get(file,{responseType:'text'});
  }

  updateFile(id:string,content:string):Observable<{status:string,message:string,programStructure:entity}>{
    return this.httpClient.put<{status:string,message:string,programStructure:entity}>(this.api + "editor/update-file",{id:id,content:content});
  }

  updateScriptModels(script:string,networks:string[]):Observable<myScript>{
    return this.httpClient.put<myScript>(this.api + "editor/update-models",{script:script,networks:networks});
  }
}
