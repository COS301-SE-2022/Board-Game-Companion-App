import { Component, OnInit } from '@angular/core';
import { BggSearchService } from '../../shared/services/bgg-search/bgg-search.service';
import { SearchResult } from '../../shared/models/search-result';
import { XmlParser } from '@angular/compiler';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import {CommonModule} from '@angular/common';


@Component({
  selector: 'board-game-companion-app-carousel2',
  templateUrl: './carousel2.component.html',
  styleUrls: ['./carousel2.component.scss'],
})
export class Carousel2Component implements OnInit {
  constructor(private bggSearch:BggSearchService, private router:Router){}
  
  defaultTransform:number = 0;
  ids: string[] = [];
  width:number = 0;


  listResults: SearchResult[] = new Array<SearchResult>();

  ngOnInit(): void {

    this.bggSearch.getComments("https://api.geekdo.com/xmlapi2/search?query=a&type=boardgame")
        .subscribe(
          data=>
          {
  
            //get the id of the elements
            const listOfBoardGames = new window.DOMParser().parseFromString(data.toString(), "text/xml");
            const idlist:string[] = [];
            
            listOfBoardGames.querySelectorAll("item").forEach(i=>{
              idlist.push(i.getAttribute("id") || "");
            });
            this.ids = idlist.slice(0,20);
            for(let j = 0; j<this.ids.length; j++)
            {
              
              //if id at j is defined
              if(this.ids[j]!=null)
              {
                this.width = this.width + 164;
              this.bggSearch.getComments("https://boardgamegeek.com/xmlapi2/thing?id="+this.ids[j])
                  .subscribe(
                    
                    data=>{
                      
                      
                      const result:string = data.toString();
                      let name = "";
                      let url = "";
                      let age = "";
                      let designer = "";
                      let minPlayers = "";
                      let maxPlayers = "";
                      let minPlayTime = "";
                      let maxPlayTime = "";
                      let category = "";

                      const parseXml = new window.DOMParser().parseFromString(result, "text/xml");
                    
                      parseXml.querySelectorAll("name").forEach(n=>{
                        name = n.getAttribute("value") || "";
                      });
                      parseXml.querySelectorAll("image").forEach(imgUrl=>{
                          url = imgUrl.innerHTML;
                          
                      });

                      console.log(url);
                      
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
              });        
  }
  
  getDetails(id:string)
  {
    this.router.navigate(['board-game-details', {my_object: id}] )

  }

  goNext() {
    const slider = document.getElementById("slider")
    if(slider !== null)
    {
      if (Math.abs(this.defaultTransform) < this.width)  this.defaultTransform = this.defaultTransform - 398;
      slider.style.transform = "translateX(" + this.defaultTransform + "px)";
    }
  }
 goPrev() {
    const slider = document.getElementById("slider")
    if(slider !== null)
    {
      if (Math.abs(this.defaultTransform) === 0) this.defaultTransform = 0;
      else this.defaultTransform = this.defaultTransform + 398;
      slider.style.transform = "translateX(" + this.defaultTransform + "px)";
    }
    
  }

}
