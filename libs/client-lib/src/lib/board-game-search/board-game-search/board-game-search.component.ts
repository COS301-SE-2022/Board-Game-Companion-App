import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BggSearchService,MostActive } from '../bgg-search-service/bgg-search.service';
import { SearchResult } from '../../shared/models/general/search-result';
import { XmlParser } from '@angular/compiler';
import { HttpClient } from '@angular/common/http';
import { NotificationComponent } from '../../shared/components/notification/notification.component';

@Component({
  selector: 'board-game-companion-app-board-game-search',
  templateUrl: './board-game-search.component.html',
  styleUrls: ['./board-game-search.component.scss'],
})
export class BoardGameSearchComponent implements OnInit {
  mostActive:MostActive[] = [];
  show:MostActive[] = [];
  show2:MostActive[] = [];
  visited: string[] = [];
  listResults: SearchResult[] = new Array<SearchResult>();
  contentType = "Most Active";
  searchValue = "";
  selected = "";
  searchMode = "approximate";
  left = 1;
  middle = 2;
  right = 3;
  current = 1;
  boardsPerPage = 14;
  size = 0;
  exactMatch = false;
  loadingContent = false;
  countLoadedContent = 0;
  loadingTopGames = false;
  countLoadedTopGames = 0;
  loadingRecentlyViewed = false;
  countLoadedRecentlyViewed = 0;
  @ViewChild(NotificationComponent,{static:true}) notifications!: NotificationComponent;

  constructor(private readonly searchService:BggSearchService, private router:Router, private route:ActivatedRoute) {
  }

  doneContent(): void{
    this.countLoadedContent++;
    if(this.countLoadedContent === this.show.length)
      this.loadingContent = false;
  }

  doneTopGames(): void{
    this.countLoadedTopGames++;

    if(this.countLoadedTopGames === this.show2.length)
      this.loadingTopGames = false;
  }

  doneRecentlyViewed(): void{
    this.countLoadedRecentlyViewed++;

    if(this.countLoadedRecentlyViewed === this.listResults.length)
      this.loadingRecentlyViewed = false;
  }

  ngOnInit(): void {
    // console.log("----->::"+ this.mostActive.length);
    if(this.mostActive.length == 0){
      this.loadingContent = true;
      this.loadingTopGames = true;
      this.countLoadedContent = 0;
      this.countLoadedTopGames = 0;

      this.searchService.getMostActive().subscribe({
        next:(result) => {
          this.contentType = "Most Active";
          this.mostActive = this.searchService.parseMostActive(result.toString());
          this.show = this.mostActive.slice(0,this.boardsPerPage);
          this.show2 = this.mostActive.slice(0,4);
          this.size = this.mostActive.length;
        },
        error:() => {
          alert()
          this.notifications.add({type:"warning",message:"Failed to most popular boardgames"})
          this.loadingContent = false;
          this.loadingTopGames = false;
        }
      });

      this.loadingRecentlyViewed = true;
      this.countLoadedRecentlyViewed = 0;

      this.visited = JSON.parse(localStorage.getItem("recentlyVisited")||"");
      
      if(this.visited.length === 0)
        this.loadingRecentlyViewed = false;

      for(let j = 0; j<this.visited.length; j++)
      {
        
        //if id at j is defined
        if(this.visited[j]!=null)
        {
          this.searchService.getComments("https://boardgamegeek.com/xmlapi2/thing?id="+this.visited[j])
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
                  if(name == "")
                    name = n.getAttribute("value") || "";
                });
                parseXml.querySelectorAll("image").forEach(imgUrl=>{
                    url = imgUrl.innerHTML;
                    
                });

                // console.log(url);
                
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
      
                
                this.listResults.push(new SearchResult(name, url, age, designer, minPlayers, maxPlayers, minPlayTime, maxPlayTime, category, this.visited[j]))
                  

                    
              });
            }
          } 
    }
  }

  changePage(page:number):void{
    // console.log("------:: in change: "+page);
    this.show = this.mostActive.slice((page - 1) * 14,page * 14);
  }

  getDetails(id:string): void{
    this.router.navigate(['board-game-details'], { state: { value: id } });
  }

  changeSearchMode(value:string):void{
    this.searchMode = value;
  }

  
  sort():void{
    let temp:MostActive;

    for(let count = 0; count < this.mostActive.length - 1; count++){
      for(let step = count + 1; step < this.mostActive.length; step++){
        if(this.mostActive[step].name.length < this.mostActive[count].name.length){
          temp = this.mostActive[step];
          this.mostActive[step] = this.mostActive[count];
          this.mostActive[count] = temp;
        }
      }
    }
  }

  checkSearchOnEnter(value:any): void{
    if(value.key === "Enter"){
      value?.preventDefault();
      this.search();
    }
  }

  search():void {
    let retrieved = 0;
    let required = 0;

    this.loadingContent = true;
    this.countLoadedContent = 0;

    this.searchService.getBoardGameByName(this.searchValue,this.exactMatch).subscribe({
      next:(result) => {
        const temp:MostActive[] = this.searchService.parseGetBoardGameByName(result.toString());
        required = temp.length;
        this.mostActive = [];
  
        for(let count = 0; count < temp.length; count++){
          this.searchService.getBoardGameById(temp[count].id).subscribe({
            next:(result) => {
              retrieved++;
              this.mostActive.push(this.searchService.parseGetBoardGameById(result));
              
              if(this.mostActive[this.mostActive.length - 1].image === ''){
                this.mostActive[this.mostActive.length - 1].image = 'assets/images/logo.png';
              }
    
              if(retrieved == required){
                this.contentType = this.mostActive.length + " Result" + (this.mostActive.length == 1 ? "" : "s");
                this.sort();
                this.show = this.mostActive.slice(0,this.boardsPerPage);
                this.size = this.mostActive.length;
    
                dispatchEvent(new Event('reloadPagination'));
                
                this.ngOnInit();
              }
            },
            error:() => {
              this.notifications
              retrieved++;
              if(retrieved == required){
                this.contentType = this.mostActive.length + " Result" + (this.mostActive.length == 1 ? "" : "s");
                this.sort();
                this.show = this.mostActive.slice(0,this.boardsPerPage);
                this.size = this.mostActive.length;
                dispatchEvent(new Event('reloadPagination'));
                this.ngOnInit();
              }           
            }
        })
        }
      },
      error:() => {
        this.loadingContent = false;
        this.notifications.add({type:"danger",message:"Failed to load the search results of '" + this.searchValue + "'"})
      }
    })
  }

  onSort(): void{

    if(this.show.length!==0){
      //sorting based on selected value...
      if(this.selected==="alphabetical"){
        this.mostActive.sort(function(resultA: { name: string; }, resultB: { name: string; })
        {
          const nameA = resultA.name.toUpperCase(); 
          const nameB = resultB.name.toUpperCase();
  
          if (nameA < nameB) 
          {
            return -1;
          }
          if (nameA > nameB)
          {
            return 1;
          }
  
          return 0;
        });
        this.show = this.mostActive.slice(0,this.boardsPerPage);
        this.size = this.mostActive.length;
        dispatchEvent(new Event('reloadPagination'));
        this.ngOnInit();
      }
    }
  }
}
