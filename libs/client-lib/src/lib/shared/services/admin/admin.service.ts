import { Injectable, NgModule } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Socket } from 'ngx-socket-io';
import { moderator } from '../../models/admin/moderator';
import { user } from '../../models/general/user';

@Injectable()
export class AdminService {
  private api = "";

  constructor(private readonly httpClient:HttpClient,
              private readonly socket: Socket) { 
    this.api = "http://localhost:3333/api/";
    //this.api = "https://board-game-companion-app-api.herokuapp.com/api/"
  }

  create(email:string):Observable<moderator>{
      return this.httpClient.post<moderator>(this.api + "admin/create",{email:email});
  }

  setAdmin(id:string,admin:boolean):Observable<moderator>{
      return this.httpClient.put<moderator>(this.api + "admin/set-admin",{id:id,admin:admin}); 
  }

  
  getAll():Observable<moderator[]>{  
      return this.httpClient.get<moderator[]>(this.api + "admin/retreive-all")
  }

  remove(id:string):Observable<moderator>{
      let param = new HttpParams();
      param = param.set("id",id);

      return this.httpClient.delete<moderator>(this.api + "admin/remove",{params: param});
  }

  search(term:string):Observable<user[]>{
      let param = new HttpParams();
      param = param.set("term",term);

      return this.httpClient.get<user[]>(this.api + "admin/search",{params: param});
  }

  countDownloaders():Observable<number>{
      return this.httpClient.get<number>(this.api + "admin/count-downloaders");
  }

  countCollectionOwners():Observable<number>{
      return this.httpClient.get<number>(this.api + "admin/count-collection-owners");
  }

  
  countScriptAuthors():Observable<number>{
      return this.httpClient.get<number>(this.api + "admin/count-script-authors");
  }

  activeUsers():Observable<number>{
    return this.socket.fromEvent("users");
  }

  login():Observable<number>{
    return this.socket.fromEvent("login-count")
  }

  logout():Observable<number>{
    return this.socket.fromEvent("logout-count")
  }

  getTotalAccounts():Observable<number>{
    return this.httpClient.get<number>(this.api + "admin/count-total-accounts");
  }

  getInitialActiveAccounts():Observable<number>{
    return this.httpClient.get<number>(this.api + "admin/count-active-accounts");
  }

  getInitialLoggedUsers():Observable<number>{
    return this.httpClient.get<number>(this.api + "admin/count-loggedIn-users");
  }
}
