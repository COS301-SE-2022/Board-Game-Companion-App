import { Component, Input, OnChanges, Output, SimpleChange ,EventEmitter} from '@angular/core';
import { BggSearchService } from '../services/bgg-search.service';
import { SearchResult } from '../classes/search-result';
import { XmlParser } from '@angular/compiler';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'board-game-companion-app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss']
  
})
export class CarouselComponent implements OnChanges {
  constructor(private bggSearch:BggSearchService) {}
  
  

  @Input()
  ids!: string[];
  

  listResults: SearchResult[] = [new SearchResult("","")];


  ngOnChanges(): void {

    for(let j = 0; j<5 &&j<this.ids.length; j++)
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

              let parseXml = new window.DOMParser().parseFromString(result, "text/xml");
            
              parseXml.querySelectorAll("name").forEach(n=>{
                name = n.getAttribute("value") || "";
            });
              parseXml.querySelectorAll("image").forEach(imgUrl=>{
                  url = imgUrl.innerHTML;
              });

              const myContainer = document.getElementById('setOne') as HTMLElement ;
              if(myContainer != null)
              {
                for(let i = 0; i<this.listResults.length; i++)
                {
                  if(j == 0)
                  {
                    myContainer.innerHTML += "<div class=\"carousel-item active relative object-center float-left w-full\"  style=\"height:500px;\"><button type=\"button\" (click)=\"getDetails()\"><img class= \"block w-full\" src = \"" +url+ "\" height = \"500px\"></button><div class=\"carousel-caption hidden md:block absolute text-center\"><h3 class=\"text-7xl\">"+name+"</h3></div></div>"
                  }
                  else
                  {
                    myContainer.innerHTML += "<div class=\"carousel-item relative object-center float-left w-full\"  style=\"height:500px;\"><button type=\"button\" (click)=\"getDetails()\"><img class= \"block w-full\" src = \"" +url+ "\" height = \"500px\"></button><div class=\"carousel-caption hidden md:block absolute text-center\"><h3 class=\"text-7xl\">"+name+"</h3></div></div>"
                  }
                  
                  
                }
              }
            });
          }
    }
    
          
        
        
          
        
    
  }

  
}
