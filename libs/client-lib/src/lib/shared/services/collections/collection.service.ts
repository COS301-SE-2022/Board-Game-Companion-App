import { Injectable, NgModule } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { user } from '../../models/general/user';
import { collection } from '../../models/collection/collection';
import { automataScript } from '../../models/scripts/automata-script';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { environment } from '../../../../../../../apps/client/src/environments/environment';


@Injectable()
export class CollectionService {
  private api = "";

  constructor(private readonly httpClient:HttpClient) { 
    this.api = environment.baseUrl;
    //this.api = "https://board-game-companion-app-api.herokuapp.com/api/"
  }

  getCollectionsForUser():Observable<collection[]>{
    let param = new HttpParams();
    param = param.set("ownerName",sessionStorage.getItem("name") as string);
    param = param.set("ownerEmail",sessionStorage.getItem("email") as string);

    return this.httpClient.get<collection[]>(this.api + "collections/get-collections",{params:param})
  }
  
  createCollection(name:string):Observable<collection>{
    const owner:user = {
      name: sessionStorage.getItem("name") as string,
      email: sessionStorage.getItem("email") as string
    }

    return this.httpClient.post<collection>(this.api + "collections/create-collection",{name:name,owner:owner});
  }

  removeCollection(name:string):Observable<number>{
    let param = new HttpParams();
    param = param.set("name",name);
    param = param.set("ownerName",sessionStorage.getItem("name") as string);
    param = param.set("ownerEmail",sessionStorage.getItem("email") as string);
    
    return this.httpClient.delete<number>(this.api + "collections/remove",{params:param})
  }

  removeBoardGame(name:string,game:string):Observable<number>{
    let param = new HttpParams();
    param = param.set("name",name);
    param = param.set("game",game);
    param = param.set("ownerName",sessionStorage.getItem("name") as string);
    param = param.set("ownerEmail",sessionStorage.getItem("email") as string);
    
    return this.httpClient.delete<number>(this.api + "collections/remove-board-game",{params: param});
  }


  removeCollectionById(id:string):Observable<number>{
    let param = new HttpParams();
    param = param.set("id",id);
    
    return this.httpClient.delete<number>(this.api + "collections/remove-by-id", {params: param});
  }

  addGameToCollection(name:string,game:string):Observable<boolean>{
    const owner:user = {
      name: sessionStorage.getItem("name") as string,
      email: sessionStorage.getItem("email") as string
    }

    return this.httpClient.put<boolean>(this.api + "collections/add-game",{owner:owner,name:name,game:game});
  }

  getScripts(id:string):Observable<automataScript[]>{
    let param = new HttpParams();
    param = param.set("id",id);

    return this.httpClient.get<automataScript[]>(this.api + "collections/get-scripts",{params: param});
  }

  
  alreadyExists(name:string):Observable<boolean>{
    let param = new HttpParams();
    param = param.set("ownerName",sessionStorage.getItem("name") as string);
    param = param.set("ownerEmail",sessionStorage.getItem("email") as string);
    param = param.set("name",name);

    return this.httpClient.get<boolean>(this.api + "collections/already-exist",{params: param});
  }
}
