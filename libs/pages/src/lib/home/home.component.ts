import { Component, OnInit } from '@angular/core';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { BggSearchService } from 'libs/shared/src/lib/services/bgg-search.service';

@Component({
  selector: 'board-game-companion-app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  
})
export class HomeComponent implements OnInit {
  constructor(private bggSearch:BggSearchService) {}
  ids: string[] | undefined;
  
  ngOnInit(): void {
    
    //check if there are existing collections
    
    if (localStorage.getItem("collection") === null ||localStorage.getItem("collection") == "[]") {
      //there arent any collections
      
      //get five random ID's to display as suggestions
      this.bggSearch.getComments("https://api.geekdo.com/xmlapi2/search?query=a&type=boardgame")
      .subscribe(
        data=>
        {

          //get the id of the elements
          let listOfBoardGames = new window.DOMParser().parseFromString(data.toString(), "text/xml");
          let idlist:string[] = [];
          
          listOfBoardGames.querySelectorAll("item").forEach(i=>{
            idlist.push(i.getAttribute("id") || "");
          });
          this.ids = idlist.slice(0,5);
        });

      }
    
    else
    {
      //there are
      this.ids =JSON.parse(localStorage.getItem("collection")||"")
    }


    

  }
}
