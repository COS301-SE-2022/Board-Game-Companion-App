import { Injectable, NgModule } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

@Injectable()
export class ModelsService {
  private api = "";

  constructor(private readonly httpClient:HttpClient){
    this.api = "http://localhost:3333/api/"
  }

  createModel(data:any[],inputFeatures:string[],outputLabels:string[]):Observable<any>{
    return this.httpClient.post<any>(this.api + "models/create",{data:data,inputFeatures:inputFeatures,outputLabels:outputLabels});
  }

}
