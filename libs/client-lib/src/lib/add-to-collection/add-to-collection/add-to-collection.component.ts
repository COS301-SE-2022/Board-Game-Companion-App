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
  options = [];
  named = "";
  newCollection(): void{
    //get name of collection from the text box,
    const name = (<HTMLInputElement>document.getElementById('collectionName')).value ||"";


    //check if collections exists
    if (localStorage.getItem("collections") === null) {
      //there is no collections set, so we must set it then add
      const collections = [name];
      const collection = [this.id]
      

      localStorage.setItem("collections", JSON.stringify(collections));
      localStorage.setItem(name, JSON.stringify(collection));


    }
    else
    {
      //check if name is already there
      const collections = JSON.parse(localStorage.getItem("collections")||"");
      if(!collections.includes(name))
      {
        
        //the name is a new collection
        collections.push(name);
        //save to local storage
        localStorage.setItem("collections", JSON.stringify(collections));

        //save the collection to local storage

        
        const collection = [this.id];
        localStorage.setItem(name, JSON.stringify(collection));
      }
      else
      {
        //the collection is already there so just add the id to the existing collection
        const collection = JSON.parse(localStorage.getItem(name)||"");
        if(!collection.includes(this.id))
        {
          collection.push(this.id);
        }
        localStorage.setItem(name, JSON.stringify(collection));
      }
    }
    this.router.navigate(['home']);
  }

  selected(event: any)
  {
    console.log(event.target.value);
    this.named = event.target.value;
  }

  addtoCollection(): void{
    //get the list value from the select form
    
    if(this.named != null)
    {
      console.log(this.named);
      //collection exists, so just add to it
      const collection = JSON.parse(localStorage.getItem(this.named)||"");
      if(!collection.includes(this.id))
      {
        collection.push(this.id);
      }

      
      localStorage.setItem(this.named, JSON.stringify(collection));
      
      this.router.navigate(['home']);
      }
    
  }
  ngOnInit(): void {
    //set id
    this.id = this.route.snapshot.paramMap.get('my_object')||"";
    
    if (!localStorage.getItem("collections") !== null) {
      //there are some collections to display in the form
      this.options = JSON.parse(localStorage.getItem("collections")||"");
      
      
    }

  }
}
