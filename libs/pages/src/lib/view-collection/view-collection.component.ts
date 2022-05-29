import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { BggSearchService } from 'libs/shared/src/lib/services/bgg-search.service';

@Component({
  selector: 'board-game-companion-app-view-collection',
  templateUrl: './view-collection.component.html',
  styleUrls: ['./view-collection.component.scss'],
})
export class ViewCollectionComponent implements OnInit {
  constructor(private bggSearch:BggSearchService, private route: ActivatedRoute,private router:Router) {}
  games: boardGameImage[] = new Array<boardGameImage>();
  name:string = "";
  
  del = false;

  deletion()
  {
    if(this.del)
    {
      let myContainer = document.getElementById('delButton') as HTMLInputElement;
      myContainer.innerHTML = "Remove Games?";
    }
    else
    {
      let myContainer = document.getElementById('delButton') as HTMLInputElement;
      myContainer.innerHTML = "Cancel?";
      console.log("here")
    }
    

    this.del = !this.del;

  }

  bgClick(id:string)
  {
    //
    if(this.del == false)
    {
      //send them through to details
      this.router.navigate(['board-game-details', {my_object: id}] )

    }
    else
    {
      //delete the board game
      if(localStorage.getItem(this.name||"") !== null)
      {
        let ids = JSON.parse(localStorage.getItem(this.name)||"");
        const index = ids.indexOf(id, 0);
        if (index > -1) {
          ids.splice(index, 1);
        }
        localStorage.setItem(this.name, JSON.stringify(ids));
      }
      for(let i = 0; i<this.games.length;i++)
      {
        if(this.games[i].id==id)
        {
          delete this.games[i];
        }
      }
    }
  }

  ngOnInit(): void {

    //get name of collection
    this.name = this.route.snapshot.paramMap.get('my_object')||"";
    //get ids of games
    if(localStorage.getItem(this.name||"") !== null)
    {
      let ids = JSON.parse(localStorage.getItem(this.name)||"");
      for(let j = 0;j<ids.length;j++)
      {
        this.bggSearch.getComments("https://boardgamegeek.com/xmlapi2/thing?id="+ids[j])
              .subscribe(
                data=>{
                  //
                  let result:string = data.toString();

                  let parseXml = new window.DOMParser().parseFromString(result, "text/xml");
                  parseXml.querySelectorAll("thumbnail").forEach(imgUrl=>{
                    this.games.push(new boardGameImage(ids[j],imgUrl.innerHTML));
                  });

                });
      }
    }
  }
}
class boardGameImage
{
  public id:string;
  public imgUrl:string;
  constructor(i:string, url:string)
  {
    //
    this.id=i;
    this.imgUrl=url;


  }
}