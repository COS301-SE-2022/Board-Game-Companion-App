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



  addToCollection()
  {
    if(document.getElementById('addGame')?.getAttribute("value") == "add")
    {
      if (localStorage.getItem("collection") === null) {
        //collection is empty
        //create array
        let collection = [document.getElementById("addGame")?.getAttribute("value")]

        localStorage.setItem("collection", JSON.stringify(collection));

        //change button
        let elem = document.getElementById('addGame') as HTMLElement;
        if(elem != null)
        {
          elem.innerHTML = "remove from collection";
          elem.setAttribute("value", "remove")
        }

      }
      else
      {
        //there is a collection

        //get the array
        let collection = JSON.parse(localStorage.getItem("collection")||"");
        if(!collection.includes(this.id))
        {
          
          //element isnt in collection, we can add
          collection.push(this.id);
          //save to local storage
          localStorage.setItem("collection", JSON.stringify(collection));
          //update the button
          let elem = document.getElementById('addGame') as HTMLElement;
          if(elem != null)
          {
            elem.innerHTML = "remove from collection";
            elem.setAttribute("value", "remove")
          }

        }
      }
    }
    else{
      if (localStorage.getItem("collection") !== null) {
        //the collection exists, retrieve it
        let collection = JSON.parse(localStorage.getItem("collection")||"");
        const index = collection.indexOf(this.id);
        if (index > -1) {
          collection.splice(index, 1); // remove the element from the array
        }
        //save to local storage
        localStorage.setItem("collection", JSON.stringify(collection));

        //update the button
        let elem = document.getElementById('addGame') as HTMLElement;
        if(elem != null)
        {
          elem.innerHTML = "Add to collection!";
          elem.setAttribute("value", "add")
        }

      }
    }
  }

  ngOnInit(): void {
    //get id
    this.id = this.route.snapshot.paramMap.get('my_object')||"";
    //;

    //check if board game has been added to a collection
    if (localStorage.getItem("collection") === null) 
    {
      //nothing added
      
    }
    else
    {
      //there is a collection check it
      let collection = JSON.parse(localStorage.getItem("collection")||"");
      if(collection.includes(this.id))
      {
        //we must change the button button
        
        let elem = document.getElementById('addGame') as HTMLElement;
        if(elem != null)
        {
          elem.innerHTML = "remove from collection";
          elem.setAttribute("value", "remove")
        }
      }
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

            
            });
}
}