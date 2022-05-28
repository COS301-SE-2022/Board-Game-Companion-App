import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { BggSearchService } from 'libs/shared/src/lib/services/bgg-search.service';
import { Router } from '@angular/router';

@Component({
  selector: 'board-game-companion-app-board-game-details',
  templateUrl: './board-game-details.component.html',
  styleUrls: ['./board-game-details.component.scss'],
})
export class BoardGameDetailsComponent implements OnInit {
  constructor(private bggSearch:BggSearchService, private route: ActivatedRoute, private router:Router) {}

  id:string = "1010";



  addToCollection()
  {
    this.router.navigate(['addGame', {my_object: this.id}]);

    
    
  }

  ngOnInit(): void {
    //get id
    this.id = this.route.snapshot.paramMap.get('my_object')||"";
    //;

    

    
    

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
                description = description.replace(/&amp;#10;/g,'');
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

            
            });
}
}