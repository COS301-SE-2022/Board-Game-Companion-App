import { Component, OnInit } from '@angular/core';
import { BggSearchService } from '../services/bgg-search.service';
import { SearchResult } from '../classes/search-result';
import { XmlParser } from '@angular/compiler';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'board-game-companion-app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss']
  
})
export class CarouselComponent implements OnInit {
  constructor(private bggSearch:BggSearchService) {}

  listResults: SearchResult = new SearchResult("","");

  ngOnInit(): void {
    
    this.bggSearch.getComments("https://boardgamegeek.com/xmlapi2/thing?id=43490")
    .subscribe(

      
      data=>
      {
        
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
        this.listResults = new SearchResult(name, url);
        
        
        const myContainer = document.getElementById('setOne') as HTMLElement ;
        if(myContainer != null)
        {
          myContainer.innerHTML +="<p>"+name+"</p><br>"
          myContainer.innerHTML += "<img src=\""+url+"\"width=\"42\" height=\"42\">";
        }
        
        
      }
      
    );
    
  }
}
