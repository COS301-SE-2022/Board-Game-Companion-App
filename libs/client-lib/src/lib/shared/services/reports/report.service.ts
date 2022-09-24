import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { user } from '../../models/general/user';
import { report } from '../../models/scripts/report';

@Injectable()
export class ReportService {
  private api = "";

  constructor(private readonly httpClient:HttpClient) { 
    this.api = "http://localhost:3333/api/";
  }

  report(script:boolean,link:string,message:string): Observable<report>{
    const userName = sessionStorage.getItem("name") as string;
    const userEmail = sessionStorage.getItem("email") as string;

    return this.httpClient.post<report>(this.api + "reports/report",{userName:userName,userEmail:userEmail,script:script,link:link,message:message});       
  }

  getAll():Observable<report[]>{
    return this.httpClient.get<report[]>(this.api + "reports/retrieve-all");
  }

  remove(id:string):Observable<report>{
    let param = new HttpParams();
    param = param.set("id",id);

    return this.httpClient.delete<report>(this.api + "reports/remove",{params:param});
  }

  getByScript(id:string):Observable<report[]>{
    let param = new HttpParams();
    param = param.set("id",id);

    return this.httpClient.get<report[]>(this.api + "reports/retrieve-by-id",{params:param});
  }

  alreadyIssued(link:string):Observable<boolean>{
    let param = new HttpParams();
    param = param.set("userName",sessionStorage.getItem("name") as string);
    param = param.set("userEmail",sessionStorage.getItem("email") as string);
    param = param.set("link",link);

    return this.httpClient.get<boolean>(this.api + "reports/already-issued",{params:param});
  }

  countReportedScripts():Observable<number>{
      return this.httpClient.get<number>(this.api + "reports/count-reported");
  }   

}
