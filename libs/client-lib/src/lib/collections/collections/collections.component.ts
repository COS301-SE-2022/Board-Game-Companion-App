import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { BggSearchService } from '../../shared/services/bgg-search/bgg-search.service';


@Component({
  selector: 'board-game-companion-app-collections',
  templateUrl: './collections.component.html',
  styleUrls: ['./collections.component.scss'],
})
export class CollectionsComponent implements OnInit {
  constructor(private bggSearch:BggSearchService, private router:Router) {}

  collections: collectionList[] = new Array<collectionList>();
  public selected = "";
  public searchedValue = "";

  // eslint-disable-next-line @typescript-eslint/ban-types
  viewCollection(n:String)
  {
    //
    this.router.navigate(['viewCollection', {my_object: n}] )
  }

  //delete a selected collection
  deletion(n:string)
  {
    localStorage.removeItem(n);
    let c = JSON.parse(localStorage.getItem("collections")||"")
    let index = c.indexOf(n, 0);
    if (index > -1) {
      c.splice(index, 1);
    }
    localStorage.setItem("collections", JSON.stringify(c))
    window.location.reload()
  }

  ngOnInit(): void {

    //get collections

    //get images for things in collection

    if(localStorage.getItem("collections") === null ||localStorage.getItem("collections") == "[]")
    {
      //there are no collections
    }
    else
    {
      const  names:string[] = JSON.parse(localStorage.getItem("collections")||"");

      for(let i=0; i<names.length;i++)
      {
        //get the 
        const ids:string[] = JSON.parse(localStorage.getItem(names[i])||"");
        const urls:string[] = new Array<string>();
        for(let j=0; j<ids.length&&j<4;j++)
        {
          if(ids[j]!=null)
          {
            this.bggSearch.getComments("https://boardgamegeek.com/xmlapi2/thing?id="+ids[j])
                .subscribe(
                  data=>{
                  const result:string = data.toString();
                  const parseXml = new window.DOMParser().parseFromString(result, "text/xml");
                  parseXml.querySelectorAll("thumbnail").forEach(imgUrl=>{
                    urls.push(imgUrl.innerHTML);
                });


          });
          }
        }

        this.collections.push(new collectionList(names[i],urls));
      }
    }
    console.log(this.collections)
  }
  onSearch(): void
  {
    console.log("on search: "+this.searchedValue);
    this.collections = new Array<collectionList>();
    this.ngOnInit();
    if(this.collections.length!==0)
    {
      let temp = new Array<collectionList>();
      temp = this.collections;
      this.collections = new Array<collectionList>();
      this.collections = temp.filter((res) => res.name.toLowerCase() === this.searchedValue.toLowerCase());
    }
  }

  onSort(): void
  {
    this.collections = new Array<collectionList>();
    this.ngOnInit();
    
    if(this.selected==="alphabetical")
    {
      this.collections.sort(function(resultA, resultB) 
      {
        const nameA = resultA.name.toUpperCase(); // ignore upper and lowercase
        const nameB = resultB.name.toUpperCase(); // ignore upper and lowercase

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
    }
    else if(this.selected==="amount")
    {
      this.collections.sort(function(resultA, resultB) 
      {
        const numberA = resultA.imgUrls.length;
        const numberB = resultB.imgUrls.length;

        console.log("====");
        if (numberA < numberB) 
        {
          return -1;
        }
        if (numberA > numberB) 
        {
          return 1;
        }

        return 0;
      });
    }
  }
}

class collectionList
{
    public name = "";
    public imgUrls:string[] = [];

    constructor( n:string, i:string[])
    {
      this.name=n;
      this.imgUrls = i;
    }
}