import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';


export interface script{
  _id: string;
  name: string;
  author: string;
  boardgame: string;
  published: Date;
  downloads: number;
  lastdownlod: Date;
  public: boolean;
  size: number;
  Rating: number;
};

export interface rating{
  _id: string;
  user: string;
  script: string;
  value: number;
}

export interface comment{
  _id: string;
  user: string;
  time: string;
  published: Date;
  likes: number;
  dislikes: number;
  content: string;
  replies: comment[];
}

@Injectable({
  providedIn: 'root'
})
export class ScriptDetailService {
  private url = "";

  constructor(private readonly httpClient:HttpClient) { 
    this.url = "https://localhost:3333/scripts/";
  }

  getScriptById(id:string):Observable<script>{
    let queryParams = new HttpParams();
    queryParams = queryParams.append("id",id);

    return this.httpClient.get<script>(this.url + "retrieve/byid",{params:queryParams});
  }

  getScriptByName(name:string):Observable<script>{
    let queryParams = new HttpParams();
    queryParams = queryParams.append("name",name);

    return this.httpClient.get<script>(this.url + "retrieve/byname",{params:queryParams});
  }
}
