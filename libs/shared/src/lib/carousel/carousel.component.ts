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

  




  listResults: SearchResult[] = [new SearchResult("","")];

  ngOnInit(): void {
    this.listResults.pop;
    this.bggSearch.getComments("https://api.geekdo.com/xmlapi2/search?query=a&type=boardgame")
    .subscribe(

      data=>
      {

        const myContainer = document.getElementById('setOne') as HTMLElement ;
        let id:string[] = [];
      
        //get the id of the elements
        let listOfBoardGames = new window.DOMParser().parseFromString(data.toString(), "text/xml");
        listOfBoardGames.querySelectorAll("item").forEach(i=>{
          id.push(i.getAttribute("id") || "");
          
      });
      
        //list first 5 results
        for(let i = 0; i<5; i++)
        {
          //search for that element's data
          this.bggSearch.getComments("https://boardgamegeek.com/xmlapi2/thing?id="+id[i])
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
              if(myContainer != null)
              {
                for(let i = 0; i<this.listResults.length; i++)
                {
                  myContainer.innerHTML +="<div class= \"slide\"><div class=\"BGName\">"+name+"</div>"
                  myContainer.innerHTML += "<div class=\"BGImage\"><img src=\""+url+"\"width=\"42\" height=\"42\"></div></div>";
                }
              }
              
              
              
          }
          );
        }
       
        
        
          
          
        


        
        
        
      }
      
    );
    
  }
}
