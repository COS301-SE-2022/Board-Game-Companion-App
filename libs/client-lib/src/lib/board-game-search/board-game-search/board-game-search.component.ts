import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BggSearchService,MostActive } from '../bgg-search-service/bgg-search.service';

@Component({
  selector: 'board-game-companion-app-board-game-search',
  templateUrl: './board-game-search.component.html',
  styleUrls: ['./board-game-search.component.scss'],
})
export class BoardGameSearchComponent implements OnInit {
  mostActive:MostActive[] = [];
  show:MostActive[] = [];
  contentType = "Most Active";
  searchValue = "";
  selected = "";
  searchMode = "approximate";
  left = 1;
  middle = 2;
  right = 3;
  current = 1;
  boardsPerPage = 10;
  size = 0;
  exactMatch = false;

  constructor(private readonly searchService:BggSearchService, private router:Router, private route:ActivatedRoute) {
              // if it is a global search from header, move to function...
    if(this.route.snapshot.paramMap.get("value")!==null){
      this.searchValue = this.route.snapshot.paramMap.get("value")||"";
      this.search();
    } // otherwise load most active...
  }

  ngOnInit(): void {
    console.log("----->::"+ this.mostActive.length);
    if(this.mostActive.length == 0){
      this.searchService.getMostActive().subscribe(result =>{
        this.contentType = "Most Active";
        this.mostActive = this.searchService.parseMostActive(result.toString());
        this.show = this.mostActive.slice(0,this.boardsPerPage);
        this.size = this.mostActive.length;
      });
    }
  }

  changePage(page:number):void{
    console.log("------:: in change: "+page);
    this.show = this.mostActive.slice((page - 1) * 10,page * 10);
  }

  getDetails(id:string): void{
    this.router.navigate(['board-game-details', {my_object: id}] )
  }

  changeSearchMode(value:string):void{
    this.searchMode = value;
  }

  
  sort():void{
    let temp:MostActive;

    for(let count = 0; count < this.mostActive.length - 1; count++){
      for(let step = count + 1; step < this.mostActive.length; step++){
        if(this.mostActive[step].name.length < this.mostActive[count].name.length){
          temp = this.mostActive[step];
          this.mostActive[step] = this.mostActive[count];
          this.mostActive[count] = temp;
        }
      }
    }
  }

  search():void {
    let retrieved = 0;
    let required = 0;

    this.searchService.getBoardGameByName(this.searchValue,this.exactMatch).subscribe(result=>{
      const temp:MostActive[] = this.searchService.parseGetBoardGameByName(result.toString());
      required = temp.length;
      this.mostActive = [];

      for(let count = 0; count < temp.length; count++){
        this.searchService.getBoardGameById(temp[count].id).subscribe(result=>{
          retrieved++;
          this.mostActive.push(this.searchService.parseGetBoardGameById(result));
          
          if(this.mostActive[this.mostActive.length - 1].image === ''){
            this.mostActive[this.mostActive.length - 1].image = 'assets/images/logo.png';
          }

          if(retrieved == required){
            this.contentType = this.mostActive.length + " Result" + (this.mostActive.length == 1 ? "" : "s");
            this.sort();
            this.show = this.mostActive.slice(0,this.boardsPerPage);
            this.size = this.mostActive.length;

            dispatchEvent(new Event('reloadPagination'));
            
            this.ngOnInit();
          }
        },error =>{
          console.log(error);
          retrieved++;
          if(retrieved == required){
            this.contentType = this.mostActive.length + " Result" + (this.mostActive.length == 1 ? "" : "s");
            this.sort();
            this.show = this.mostActive.slice(0,this.boardsPerPage);
            this.size = this.mostActive.length;
            dispatchEvent(new Event('reloadPagination'));
            this.ngOnInit();
          }
        });
      }
    })
  }

  onSort(): void{

    if(this.show.length!==0){
      //sorting based on selected value...
      if(this.selected==="alphabetical"){
        this.mostActive.sort(function(resultA: { name: string; }, resultB: { name: string; })
        {
          const nameA = resultA.name.toUpperCase(); 
          const nameB = resultB.name.toUpperCase();
  
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
        this.show = this.mostActive.slice(0,this.boardsPerPage);
        this.size = this.mostActive.length;
        dispatchEvent(new Event('reloadPagination'));
        this.ngOnInit();
      }
    }
  }
}
