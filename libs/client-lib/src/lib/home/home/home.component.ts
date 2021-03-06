import { Component, OnInit } from '@angular/core';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { BggSearchService } from '../../shared/services/bgg-search/bgg-search.service';
import { ActivatedRoute,NavigationEnd,Router } from '@angular/router';
import { elementAt, filter } from 'rxjs';

@Component({
  selector: 'board-game-companion-app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  
})
export class HomeComponent implements OnInit {
  constructor(private bggSearch:BggSearchService, private router:Router) {
    this.router.events
	      .pipe(filter((e) => e instanceof NavigationEnd))
	      .subscribe((e: any) => {
		    // this.showHideTabs();
		    console.log(e.url);
	});
  }

  ids: string[] | undefined;
  id:string = "";
  game:string = "";
  script:string = "";
  num:string = "";
  score:string = "";
  time:string = "";
  result:string = "";
  date:string = "";
  gameId:string = "";
  img:string = "";
  collection:string = "";

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

      let title = document.createElement("div");
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
    }


    

  }
}
