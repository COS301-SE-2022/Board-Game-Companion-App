import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'board-game-companion-app-add-to-collection',
  templateUrl: './add-to-collection.component.html',
  styleUrls: ['./add-to-collection.component.scss'],
})
export class AddToCollectionComponent implements OnInit {
  constructor(private router:Router, private route: ActivatedRoute) {}

  id = "1010";
  
  newCollection(): void{
    //get name of collection from the text box,
    let name = (<HTMLInputElement>document.getElementById('collectionName')).value ||"";


    //check if collections exists
    if (localStorage.getItem("collections") === null) {
      //there is no collections set, so we must set it then add
      let collections = [name];
      let collection = [this.id]

      localStorage.setItem("collections", JSON.stringify(collections));
      localStorage.setItem(name, JSON.stringify(collection));


    }
    else
    {
      //check if name is already there
      let collections = JSON.parse(localStorage.getItem("collections")||"");
      if(!collections.includes(name))
      {
        
        //the name is a new collection
        collections.push(name);
        //save to local storage
        localStorage.setItem("collections", JSON.stringify(collections));

        //save the collection to local storage
        let collection = [this.id];
        localStorage.setItem(name, JSON.stringify(collection));
      }
      else
      {
        //the collection is already there so just add the id to the existing collection
        let collection = JSON.parse(localStorage.getItem("collections")||"");
        collection.push(this.id);
        localStorage.setItem(name, JSON.stringify(collection));
      }
    }

  }

  ngOnInit(): void {
    //set id
    this.id = this.route.snapshot.paramMap.get('my_object')||"";
    
  }
}
