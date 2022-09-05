import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { automataScript } from '../../shared/models/scripts/automata-script';
// import { script } from '../../shared/models/script';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private ApiUrl = "http://localhost:3333/api/automata-scripts/";
  constructor(private http: HttpClient) { }

  getScripts():Observable<automataScript[]>{
    return this.http.get<automataScript[]>(this.ApiUrl + "retreive-all");
  }
  getScriptById(id:string):Observable<automataScript>{
    return this.http.get<automataScript>(this.ApiUrl + "retrive-by-id");
  }
}
