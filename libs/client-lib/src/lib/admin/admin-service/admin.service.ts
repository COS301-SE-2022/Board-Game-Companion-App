import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { automataScript } from '../../shared/models/scripts/automata-script';
import { myScript } from '../../shared/models/scripts/my-script';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private ApiUrl = "http://localhost:3333/api/";
  constructor(private http: HttpClient) { }

  getScripts():Observable<automataScript[]>{
    return this.http.get<automataScript[]>(this.ApiUrl + "automata-scripts/retreive-all");
  }
  getScriptById(id:string):Observable<automataScript>{
    let param = new HttpParams();
    param = param.set("id",id);
    return this.http.get<automataScript>(this.ApiUrl + "automata-scripts/retrive-by-id",{params:param});
  }

  getUserOwnedScripts():Observable<myScript[]>{
    return this.http.get<myScript[]>(this.ApiUrl + "my-scripts/all-scripts");
  }
}
