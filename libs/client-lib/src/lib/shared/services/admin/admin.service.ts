import { Injectable, NgModule } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Socket } from 'ngx-socket-io';
import { moderator } from '../../models/admin/moderator';
import { userSearch } from '../../models/admin/userSearch';
import { ban } from '../../models/admin/ban';
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

  warn(account:user,message:string):Observable<void>{
    return this.httpClient.post<void>(this.api + "admin/warn",{name:account.name,email:account.email,message:message});
  }

  ban(name:string,email:string):Observable<ban>{
    return this.httpClient.post<ban>(this.api + "admin/ban",{name:name,email:email});
  }

  banned():Observable<boolean>{
    let param = new HttpParams();
    param = param.set("name",sessionStorage.getItem("name") as string);
    param = param.set("email",sessionStorage.getItem("email") as string);

    return this.httpClient.get<boolean>(this.api + "admin/banned",{params: param});
  }

  isAdmin():Observable<boolean>{
    let param = new HttpParams();
    param = param.set("email",sessionStorage.getItem("email") as string);

    return this.httpClient.get<boolean>(this.api + "admin/isAdmin",{params: param});
  }

  unban(email:string):Observable<ban>{
    return this.httpClient.post<ban>(this.api + "admin/unban",{email:email});
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

  search(term:string):Observable<userSearch[]>{
      let param = new HttpParams();
      param = param.set("term",term);

      return this.httpClient.get<userSearch[]>(this.api + "admin/search",{params: param});
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
