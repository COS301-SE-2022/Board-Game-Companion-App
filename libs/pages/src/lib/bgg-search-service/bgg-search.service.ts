import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http'


export interface MostActive{
  id:string,
  name:string,
  image:string
}


@Injectable({
  providedIn: 'root'
})
export class BggSearchService {
  private url = "";

  constructor(private readonly httpClient:HttpClient) { 
    this.url = "https://api.geekdo.com/xmlapi2/"
  }

  getBoardGameByName(name:string):Observable<any>{
    return this.httpClient.get(this.url + "search?query="+name+"&type=boardgame",{responseType: 'text'})
  }

  parseGetBoardGameByName(data:string):MostActive[]{
    const result: MostActive[] = []
    const list = new window.DOMParser().parseFromString(data.toString(), "text/xml");

    list.querySelectorAll('item').forEach(item=>{
        result.push({id: item.getAttribute('id') || "",name:"",image:""});
    })

    return result;
  }

  getBoardGameById(id:string):Observable<any>{
    return this.httpClient.get(this.url + "thing?id="+id,{responseType: 'text'})
  }

  parseGetBoardGameById(data:string):MostActive{
    const result: MostActive = {id:"",name:"",image:""};
    const temp: MostActive = {id:"",name:"",image:""};
    const list = new window.DOMParser().parseFromString(data.toString(), "text/xml");

    const item = list.querySelector('item');

    if(item){
      temp.id = item.getAttribute('id') || "";
      temp.image = item.querySelector("thumbnail")?.innerHTML || "";
      temp.name = item.querySelector("name")?.getAttribute('value') || "";
      
      result.id = temp.id;
      result.name = temp.name;
      result.image =temp.image;
    }

    return result;
  }

  getMostActive():Observable<any>{
    return this.httpClient.get(this.url + "hot?type=boardgame",{responseType: 'text'});
  }

  parseMostActive(data:string):MostActive[]{
    const result : MostActive[] = []; 
    const temp: MostActive = {id:"",name:"",image:""};
    const list = new window.DOMParser().parseFromString(data.toString(), "text/xml");

    list.querySelectorAll('item').forEach(item=>{
        temp.id = item.getAttribute("id") || "";
        temp.image = item.querySelector("thumbnail")?.getAttribute("value") || "";
        temp.name = item.querySelector("name")?.getAttribute("value") || "";
        result.push({id:temp.id,name:temp.name,image:temp.image});
    });

    return result;
  }
}
