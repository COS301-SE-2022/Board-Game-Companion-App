import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
// import { script } from '../../shared/models/script';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private ApiUrl = "http://localhost:3333/api/scripts/retrieve/all";
  constructor(private http: HttpClient) { }

  getScripts():Observable<any>{
    return this.http.get(this.ApiUrl);
  } 
}
