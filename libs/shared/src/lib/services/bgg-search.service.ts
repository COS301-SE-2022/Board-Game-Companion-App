import { Injectable, NgModule } from '@angular/core';
import { Observable } from 'rxjs';
import {HttpClient} from '@angular/common/http'


@Injectable({
  providedIn: 'root'
})

@NgModule()
export class BggSearchService {

  getComments(url:string):Observable<any>{

    
    return this.httpclient.get(url,{responseType: 'text'});
  }

  constructor(private httpclient: HttpClient) { }
}
