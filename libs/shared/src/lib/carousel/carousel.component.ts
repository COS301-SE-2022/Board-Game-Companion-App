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


  listResults: SearchResult[] = [];

  

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
    if (localStorage.getItem("collection") === null || localStorage.getItem("collection") == "[]") {
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
              let designer:string = "";

              let parseXml = new window.DOMParser().parseFromString(result, "text/xml");
            
              parseXml.querySelectorAll("name").forEach(n=>{
                name = n.getAttribute("value") || "";
              });
              parseXml.querySelectorAll("image").forEach(imgUrl=>{
                  url = imgUrl.innerHTML;
              });
               
                this.listResults.push(new SearchResult(name, url, this.ids[j]))
                

                  
            });
          }

          
    }
    
          
        
        
          
        
    
  }

  
}
