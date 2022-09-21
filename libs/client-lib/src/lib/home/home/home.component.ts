import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { BggSearchService, MostActive } from '../../shared/services/bgg-search/bgg-search.service';
import { ActivatedRoute,NavigationEnd,Router } from '@angular/router';
import { elementAt, filter } from 'rxjs';
import { CollectionService } from '../../shared/services/collections/collection.service';
import { collection } from '../../shared/models/collection/collection';
import { NotificationComponent } from '../../shared/components/notification/notification.component';

interface Game{
  collectionId: string;
  id: string;
  name: string;
  image: string;
}

@Component({
  selector: 'board-game-companion-app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  
})
export class HomeComponent implements OnInit {
  
  showGames:Game[] = [];
  recommendations:MostActive[] = []
  carouselPage = 0;
  carouselPageRecommendation = 0;
  maxGames = 6;
  collections:collection[] = [];
  widthPerGame = 16;
  @ViewChild(NotificationComponent,{static:true}) notifications!: NotificationComponent;

  constructor(private bggSearch:BggSearchService,
              private router:Router,
              private readonly collectionService:CollectionService) {
    this.router.events
	      .pipe(filter((e) => e instanceof NavigationEnd))
	      .subscribe((e: any) => {
		    // this.showHideTabs();
		    // console.log(e.url);
	});
  }

  ids: string[] | undefined;
  id = "";
  game = "";
  script = "";
  num = "";
  score = "";
  time = "";
  result = "";
  date = "";
  gameId = "";
  img = "";
  collection = "";
  url = "";

  viewSession(n:string)
  {
    this.router.navigate(['session', {my_object: n}] )
  }

  viewCollection(n:string)
  {
    //
    this.router.navigate(['viewCollection', {my_object: n}] )
  }

  boardGames()
  {
    this.router.navigate(['board-game-search'])
  }
  
  ngOnInit(): void {
    this.loadCollections();
    this.loadRecommendations();
    //This is old carousel code
    //check if there are existing collections
    //collections will be the array which holds the names of the collections on localStorage
    if(localStorage.getItem("collections") === null ||localStorage.getItem("collections") == "[]")
    {
      //if this is empty we have no collections
        const elem = document.getElementById("T1") as Element
        elem.innerHTML = "No collections"
        //get five random ID's to display as suggestions
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
            this.ids = idlist.slice(0,5);
          });
  
        
        
    }
    else
    {
      //there is a collection
      const  collections:string[] = JSON.parse(localStorage.getItem("collections")||"");
      this.collection = collections[0];
      //use ids for first collection in list
      this.ids =JSON.parse(localStorage.getItem(collections[0])||"");
      console.log(this.ids);
    }

    //Check if there are game sessions
    if(localStorage.getItem("sessions") == null || localStorage.getItem("sessions") == "[]")
    {
      //If there are none
      //Remove all content and replace with text
      const elem = document.getElementById("lastPlayed") as Element
      let child = elem.lastElementChild
      while(child)
      {
        elem.removeChild(child)
        child = elem.lastElementChild
      }

      const title = document.createElement("div");
      title.textContent = "No games played";
      title.setAttribute("id", "lpTitle")
      elem.appendChild(title);
      
    }
    else
    {
      const  names:string[] = JSON.parse(localStorage.getItem("sessions")||"");
      //If there are game sessions
      const session:string[] = JSON.parse(localStorage.getItem(names[names.length-1])||""); 
      this.id= names[names.length-1];
      this.game = session[0];
      this.script = session[1];
      this.num = session[2];
      this.score = session[3];
      this.time = session[4];
      this.result = session[5];
      this.date = session[6];
      this.gameId = session[7];

      if(this.gameId != null)
      {
        this.bggSearch.getComments("https://boardgamegeek.com/xmlapi2/thing?id="+this.gameId)
                  .subscribe(
                    
                    data=>{
                      
                      
                      const result:string = data.toString();

                      const parseXml = new window.DOMParser().parseFromString(result, "text/xml");
                    
                      if (parseXml.querySelectorAll("image").length ==0)
                      {
                          
                        this.url ='assets/images/No_image.png';
                      }
                      else
                      {
                        parseXml.querySelectorAll("image").forEach(imgUrl=>{
                        this.url = imgUrl.innerHTML;
                          
                       });
                      
                      }

                    })
      }
    }
  }

  @HostListener('window:resize', ['$event'])
  onScreenResize(): void{
    const width = window.innerWidth;
    
    if(width >= 1200){
      this.maxGames = 6;
      this.widthPerGame = 16;
    }else if(width >= 1000){
      this.maxGames = 4;
      this.widthPerGame = 24;
    }else if(width >= 750){
      this.maxGames = 3;
      this.widthPerGame = 32;
    }else if(width >= 450){
      this.maxGames = 2;
      this.widthPerGame = 48;
    }else{
      this.maxGames = 2;
      this.widthPerGame = 48;
    }
  }

  showGameInfo(value:Game | MostActive): void{
    this.router.navigate(['board-game-details'], { state: { value: value.id } });
  }

  loadRecommendations(): void{
    this.bggSearch.getMostActive().subscribe({
      next:(value:any) => {
        this.recommendations = this.bggSearch.parseMostActive(value.toString());
      }
    });
  }

  back(): void{
    if(this.carouselPage === 0)
      return;

    this.carouselPage -= 1;
  }

  backRecommendation(): void{
    if(this.carouselPageRecommendation === 0)
      return;

    this.carouselPageRecommendation -= 1;
  }

  next(): void{
    if((this.carouselPage + 1) * this.maxGames >= this.showGames.length)
      return;

    this.carouselPage += 1;
  }

  nextRecommendation(): void{
    if((this.carouselPageRecommendation + 1) * this.maxGames >= this.recommendations.length)
      return;

    this.carouselPageRecommendation += 1;
  }

  loadCollections(): void{
    this.collectionService.getCollectionsForUser().subscribe({
      next:(response:collection[]) => {
        this.collections = response;
        this.loadGames();
      },
      error:()=>{
        this.notifications.add({type: "warning",message: "Failed to load collections"});
      }
    })
  }

  loadGames(): void{
    this.collections.forEach((value:collection) => {
      value.boardgames.forEach((id:string) => {
        this.bggSearch.getBoardGameById(id).subscribe({
          next:(gvalue) =>{
            const game = this.bggSearch.parseGetBoardGameById(gvalue);
            const temp:Game = {
              collectionId: value._id,
              id: game.id,
              name: game.name,
              image: game.image
            }
            this.showGames.push(temp);
          },
          error:() => {
            this.notifications.add({type: "warning",message: `Failed to load board game of ${value.name}.`});
          }
        })
      })
    })
  }
}
