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
  name = "";
  
  public selected = "";
  public searchedValue = "";

  deletion(id:string)
  {
    //delete the board game
    if(localStorage.getItem(this.name||"") !== null)
    {
      const ids = JSON.parse(localStorage.getItem(this.name)||"");
      const index = ids.indexOf(id, 0);
      if (index > -1) {
        ids.splice(index, 1);
      }
      //
      
      if(ids.length ==0)
      {
        //remove the collection
        localStorage.removeItem(this.name);
        const c = JSON.parse(localStorage.getItem("collections")||"")
        const index = c.indexOf(this.name, 0);
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
    //get ids of 
    if(localStorage.getItem(this.name||"") !== null)
    {
      const ids = JSON.parse(localStorage.getItem(this.name)||"");
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
                  const result:string = data.toString();

                  const parseXml = new window.DOMParser().parseFromString(result, "text/xml");
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

  onSearch(): void
  {

    this.listResults = [];
    this.games = [];

    this.ngOnInit();
    setTimeout(()=>this.doSearch(),1000);

  }

  doSearch(): void
  {
    const temp = this.listResults;
    const temp_G = this.games;

    this.listResults = [];
    this.games = [];

    const indices = [];

    for(let index=0; index < temp.length; index++)
    {
      const element = temp[index].getName();

      if(element.toLocaleLowerCase() === this.searchedValue.toLocaleLowerCase())
      {
        indices.push(index);
      }

    }
    this.listResults = indices.map(index=>temp[index]);
    this.games = indices.map(index=>temp_G[index]);
  }

  doSort(): void
  {
    if(this.selected==="age")
    {

      const temp = this.listResults;
      const temp_G = this.games;

      const indices = Array.from(temp.keys()).sort(function(indexA,indexB)
      {
        // console.log(temp);
        const Age_1 = +temp[indexA].getAge();
        const Age_2 = +temp[indexB].getAge();
        
        if(Age_1 < Age_2)
        {
          return -1;
        }
        if(Age_1 > Age_2)
        {
          return 1;
        }

        return 0;
      });
      this.listResults = [];
      this.games = [];
      
      this.listResults = indices.map(index=>temp[index]);
      this.games = indices.map(index=>temp_G[index]);

    }
    else if(this.selected==="alphabetical")
    {

      const temp = this.listResults;
      const temp_G = this.games;


      const indices = Array.from(temp.keys()).sort((indexA,indexB)=>{

        const Name_1 = temp[indexA].getName().toUpperCase();
        const Name_2 = temp[indexB].getName().toUpperCase();

        if(Name_1 < Name_2)
        {
          return -1;
        }
        if(Name_1 > Name_2)
        {
          return 1;
        }

        return 0;
      });
      this.listResults = [];
      this.games = [];

      this.listResults = indices.map(index=>temp[index]);
      this.games = indices.map(index=>temp_G[index]);

    }
    else if(this.selected==="max")
    {

      const temp = this.listResults;
      const temp_G = this.games;

      const indices = Array.from(temp.keys()).sort((indexA,indexB)=>{

        const max_1 = +temp[indexA].getMaxPlayTime();
        const max_2 = +temp[indexB].getMaxPlayTime();
        
        if(max_1 < max_2)
        {
          return -1;
        }
        if(max_1 > max_2)
        {
          return 1;
        }

        return 0;
      });
      
      this.listResults = [];
      this.games = [];

      this.listResults = indices.map(index=>temp[index]);
      this.games = indices.map(index=>temp_G[index]);
    }
  }

  onSort(): void
  {
    console.log(this.selected);
    this.listResults = [];
    this.games = [];

    this.ngOnInit();
    setTimeout(()=>this.doSort(),1000);
    
  }
}
class boardGameImage
{
  public id = "";
  public imgUrl = "";
  constructor(i:string, url:string)
  {
    //
    this.id=i;
    this.imgUrl=url;


  }
}