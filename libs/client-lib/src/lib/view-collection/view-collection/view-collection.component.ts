import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { BggSearchService } from '../../shared/services/bgg-search/bgg-search.service';
import { SearchResult } from '../../shared/models/search-result';
import { XmlParser } from '@angular/compiler';
import { HttpClient } from '@angular/common/http';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'board-game-companion-app-view-collection',
  templateUrl: './view-collection.component.html',
  styleUrls: ['./view-collection.component.scss'],
})
export class ViewCollectionComponent implements OnInit {
  constructor(private bggSearch:BggSearchService, private route: ActivatedRoute,private router:Router) {}
  games: boardGameImage[] = new Array<boardGameImage>();
  listResults: SearchResult[] = new Array<SearchResult>();
  name:string = "";
  


  deletion(id:string)
  {
    //delete the board game
    if(localStorage.getItem(this.name||"") !== null)
    {
      let ids = JSON.parse(localStorage.getItem(this.name)||"");
      let index = ids.indexOf(id, 0);
      if (index > -1) {
        ids.splice(index, 1);
      }
      //
      
      if(ids.length ==0)
      {
        //remove the collection
        localStorage.removeItem(this.name);
        let c = JSON.parse(localStorage.getItem("collections")||"")
        let index = c.indexOf(this.name, 0);
        if (index > -1) {
          c.splice(index, 1);
        }
        localStorage.setItem("collections", JSON.stringify(ids));
      }
      else
      {
        localStorage.setItem(this.name, JSON.stringify(ids));
      }
    }
    for(let i = 0; i<this.games.length;i++)
    {
      if(this.games[i].id==id)
      {
        delete this.games[i];
      }
    }
    window.location.reload();
  }

  bgClick(id:string)
  {
    //Explore
    //send them through to details
    this.router.navigate(['board-game-details', {my_object: id}] )

  }

  ngOnInit(): void {

    //get name of collection
    this.name = this.route.snapshot.paramMap.get('my_object')||"";
    //get ids of games
    if(localStorage.getItem(this.name||"") !== null)
    {
      let ids = JSON.parse(localStorage.getItem(this.name)||"");
      for(let j = 0;j<ids.length;j++)
      {
        this.bggSearch.getComments("https://boardgamegeek.com/xmlapi2/thing?id="+ids[j])
              .subscribe(
                data=>{
                  let name2 = "";
                  let url = "";
                  let age = "";
                  let designer = "";
                  let minPlayers = "";
                  let maxPlayers = "";
                  let minPlayTime = "";
                  let maxPlayTime = "";
                  let category = "";
                  let result:string = data.toString();

                  let parseXml = new window.DOMParser().parseFromString(result, "text/xml");
                  parseXml.querySelectorAll("thumbnail").forEach(imgUrl=>{
                    this.games.push(new boardGameImage(ids[j],imgUrl.innerHTML));
                  });
                  parseXml.querySelectorAll("name").forEach(n=>{
                    name2 = n.getAttribute("value") || "";
                  });
                  parseXml.querySelectorAll("image").forEach(imgUrl=>{
                      url = imgUrl.innerHTML;
                      
                  });
                  
                  if (parseXml.querySelectorAll("image").length ==0)
                  {
                      
                      url ='assets/images/No_image.png';
                  }
                  parseXml.querySelectorAll("minage").forEach(min=>{
                    age = min.getAttribute("value") || "";
                  });
                  parseXml.querySelectorAll("link").forEach(des=>{
                    
                    if(des.getAttribute("type") == "boardgamedesigner")
                    {
                      designer = des.getAttribute("value") || "";
                    }
    
                    if(des.getAttribute("type") == "boardgamecategory")
                    {
                      category = des.getAttribute("value") || "";
                    }
                  });
                  parseXml.querySelectorAll("minplayers").forEach(min=>{
                    minPlayers = min.getAttribute("value") || "";
                  });
                  parseXml.querySelectorAll("maxplayers").forEach(max=>{
                    maxPlayers = max.getAttribute("value") || "";
                  });
                  parseXml.querySelectorAll("minplaytime").forEach(min=>{
                    minPlayTime = min.getAttribute("value") || "";
                  });
                  parseXml.querySelectorAll("maxplaytime").forEach(max=>{
                    maxPlayTime = max.getAttribute("value") || "";
                  });
        
                   
                  this.listResults.push(new SearchResult(name2, url, age, designer, minPlayers, maxPlayers, minPlayTime, maxPlayTime, category, this.name))

                });
      }
    }
  }
}
class boardGameImage
{
  public id:string;
  public imgUrl:string;
  constructor(i:string, url:string)
  {
    //
    this.id=i;
    this.imgUrl=url;


  }
}