import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { BggSearchService } from 'libs/shared/src/lib/services/bgg-search.service';


@Component({
  selector: 'board-game-companion-app-board-game-details',
  templateUrl: './board-game-details.component.html',
  styleUrls: ['./board-game-details.component.scss'],
})
export class BoardGameDetailsComponent implements OnInit {
  constructor(private bggSearch:BggSearchService, private route: ActivatedRoute) {}

  id:string = "1010";

  Added:boolean = false;

  addToCollection()
  {
    console.log(document.getElementById("addGame")?.getAttribute("value"));
  }

  ngOnInit(): void {
    //get id
    console.log(this.route.snapshot.paramMap.get('my_object'));
    this.id = this.route.snapshot.paramMap.get('my_object')||"";
    
    //check if board game has been added to a collection
    if(this.Added != true)
    {
      //if it hasnt, display button to add it
      this.Added = true;
    }


    
    

    //get info on board game from api
    this.bggSearch.getComments("https://boardgamegeek.com/xmlapi2/thing?id="+this.id)
          .subscribe(
            
            data=>{
              let result:string = data.toString();
              let name:string = "";
              let url:string = "";
              let description:string = "";

              let parseXml = new window.DOMParser().parseFromString(result, "text/xml");
            
              //get information
              parseXml.querySelectorAll("name").forEach(n=>{
                name = n.getAttribute("value") || "";
            });
              parseXml.querySelectorAll("image").forEach(imgUrl=>{
                  url = imgUrl.innerHTML;
              });
              parseXml.querySelectorAll("description").forEach(descr=>{
                description = descr.innerHTML;
            });


            //display information

            //img
            let myContainer = document.getElementById('imgDiv') as HTMLElement ;
            
            myContainer.innerHTML = "<img src = \"" +url+ "\" height = \"100%\">"
                
            //name 
            myContainer = document.getElementById('title') as HTMLElement ;
            myContainer.innerHTML = name;
            //description
            myContainer = document.getElementById('descr') as HTMLElement ;
            myContainer.innerHTML = description;

            //update button value
            myContainer = document.getElementById('addGame')as HTMLElement;
            myContainer.setAttribute("value", this.id);
            });
}
}