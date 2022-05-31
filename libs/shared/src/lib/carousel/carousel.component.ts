import { Component, Input, OnChanges, Output, SimpleChange ,EventEmitter} from '@angular/core';
import { BggSearchService } from '../services/bgg-search.service';
import { SearchResult } from '../classes/search-result';
import { XmlParser } from '@angular/compiler';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import {CommonModule} from '@angular/common';


@Component({
  selector: 'board-game-companion-app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss']
  
})
export class CarouselComponent implements OnChanges {
  constructor(private bggSearch:BggSearchService, private router:Router) {}
  
  

  @Input()
  ids!: string[];

  

  listResults: SearchResult[] = new Array<SearchResult>();

  

  getDetails(id:string)
  {

    this.router.navigate(['board-game-details', {my_object: id}] )


  }

  getCollections()
  {
    this.router.navigate(['collections'])
  }


  ngOnChanges(): void {
    
    //check if collection is empty
    if (localStorage.getItem("collections") === null || localStorage.getItem("collections") == "[]") {
      let elem = document.getElementById("head") as HTMLElement;
      elem.innerHTML = "Your collection is empty <br> here are some suggestions"

    }
    else
    {
      
      
      let elem = document.getElementById("head") as HTMLElement;
      elem.innerHTML = "Explore your collection"
      
    }

    for(let j = 0; j<this.ids.length; j++)
    {
      
      //if id at j is defined
      if(this.ids[j]!=null)
      {
      this.bggSearch.getComments("https://boardgamegeek.com/xmlapi2/thing?id="+this.ids[j])
          .subscribe(
            
            data=>{
              
              
              let result:string = data.toString();
              let name:string = "";
              let url:string = "";
              let age:string = "";
              let designer:string = "";
              let minPlayers:string = "";
              let maxPlayers:string = "";
              let minPlayTime:string = "";
              let maxPlayTime:string = "";
              let category:string = "";

              let parseXml = new window.DOMParser().parseFromString(result, "text/xml");
            
              parseXml.querySelectorAll("name").forEach(n=>{
                name = n.getAttribute("value") || "";
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
    
               
              this.listResults.push(new SearchResult(name, url, age, designer, minPlayers, maxPlayers, minPlayTime, maxPlayTime, category, this.ids[j]))
                

                  
            });
          }

          
    }
    
          
        
        
        
    
  }

  
}
