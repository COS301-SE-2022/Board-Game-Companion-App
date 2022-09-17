import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { BggSearchService } from '../../shared/services/bgg-search/bgg-search.service';
import { Router } from '@angular/router';
import { automataScript } from '../../shared/models/scripts/automata-script';
import { ScriptService } from '../../shared/services/scripts/script.service';
import { NotificationComponent } from '../../shared/components/notification/notification.component';

@Component({
  selector: 'board-game-companion-app-board-game-details',
  templateUrl: './board-game-details.component.html',
  styleUrls: ['./board-game-details.component.scss'],
})
export class BoardGameDetailsComponent implements OnInit {
  id = "1010";
  name = "";
  url = "";
  description = "";
  playerNumber = "";
  playTime = "";
  age = "";
  category = "";
  designer = "";
  artist = "";
  publisher = "";
  showFullDescription = false;
  showAutomata = false;
  scripts:automataScript[] = [];
  @ViewChild(NotificationComponent,{static:true}) notifications: NotificationComponent = new NotificationComponent();

  constructor(private readonly bggSearch:BggSearchService, 
              private readonly route: ActivatedRoute,
              private readonly router:Router,
              private readonly scriptService:ScriptService) {
    this.id = this.router.getCurrentNavigation()?.extras.state?.['value'];
  }

  ngOnInit(): void {
    this.getScripts();
    console.log(localStorage.getItem("recentlyVisited")?.length)
    //check if recently visited exists
    if (localStorage.getItem("recentlyVisited") === null) 
    {
      //there is no recently visited set, so we must set it then add
      const visited = [this.id]
      localStorage.setItem("recentlyVisited", JSON.stringify(visited));
    }
    else
    {
      let visited = JSON.parse(localStorage.getItem("recentlyVisited")||"");
      console.log(visited.length)
      if(visited.length === 4)
      {
        console.log(visited)
        visited = visited.splice(1,3)
        console.log(visited)
        if(!visited.includes(this.id))
        {
          visited.push(this.id);
          localStorage.setItem("recentlyVisited", JSON.stringify(visited));
        }
      }
      else
      {
        
        if(!visited.includes(this.id))
        {
          visited.push(this.id);
          localStorage.setItem("recentlyVisited", JSON.stringify(visited));
        }
      }
     
    }
    
    

    
    
    //get info on board game from api
    this.bggSearch.getComments("https://boardgamegeek.com/xmlapi2/thing?id="+this.id)
          .subscribe(
            
            data=>{
              const result:string = data.toString();
              
              const parseXml = new window.DOMParser().parseFromString(result, "text/xml");

              console.log(parseXml)
              
            
              //get information
              parseXml.querySelectorAll("name").forEach(n=>{
                this.name = n.getAttribute("value") || "";
              });
              parseXml.querySelectorAll("image").forEach(imgUrl=>{
                  this.url = imgUrl.innerHTML;
              });
              parseXml.querySelectorAll("description").forEach(descr=>{
                this.description = descr.innerHTML;
                this.description = this.description.replace(/&amp;#10;/g,'');
              });
              parseXml.querySelectorAll("minplayers").forEach(min=>{
                this.playerNumber  = min.getAttribute("value") || "";
                this.playerNumber = this.playerNumber + " - ";
              });
              parseXml.querySelectorAll("maxplayers").forEach(max=>{
                this.playerNumber = this.playerNumber + max.getAttribute("value") || "";
              });
              parseXml.querySelectorAll("minplaytime").forEach(min=>{
                this.playTime = min.getAttribute("value") || "";
                this.playTime = this.playTime + " - ";
              });
              parseXml.querySelectorAll("maxplaytime").forEach(max=>{
                this.playTime = this.playTime + max.getAttribute("value") || "";
              });
              parseXml.querySelectorAll("minage").forEach(age=>{
                this.age = age.getAttribute("value") || "";
              });
              parseXml.querySelectorAll("link").forEach(lin =>{
                if(lin.getAttribute("type") != null && lin.getAttribute("type") == "boardgamecategory")
                {
                  this.category = lin.getAttribute("value") || "";
                }
                if(lin.getAttribute("type") != null && lin.getAttribute("type") == "boardgamedesigner")
                {
                  this.designer = lin.getAttribute("value") || "";
                }
                if(lin.getAttribute("type") != null && lin.getAttribute("type") == "boardgameartist")
                {
                  this.artist = lin.getAttribute("value") || "";
                }
                if(lin.getAttribute("type") != null && lin.getAttribute("type") == "boardgamepublisher")
                {
                  this.publisher = lin.getAttribute("value") || "";
                }
            });
          })
  }

  getScripts(): void{
    this.scriptService.getByGame(this.id).subscribe({
      next:(value:automataScript[])=>{
        this.scripts = value;
      },
      error:(err)=>{
        this.notifications.add({type:"warning",message:"Failed to load the board game scripts."})
      }
    })
  }

  showInfo(value:automataScript){
    this.router.navigate(['script-detail'], { state: { value: value } });
  }
}