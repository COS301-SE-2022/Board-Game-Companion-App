import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
  left = 1;
  middle = 2;
  right = 3;
  current = 1;
  boardsPerPage = 10;

  constructor(private readonly searchService:BggSearchService, private router:Router) {
    
  }

  ngOnInit(): void {
    if(this.mostActive.length == 0){
      this.searchService.getMostActive().subscribe(result =>{
        this.contentType = "Most Active";
        this.mostActive = this.searchService.parseMostActive(result.toString());
        this.show = this.mostActive.slice(0,this.boardsPerPage);
      });
    }
  }

  changePage(page:number):void{
    this.show = this.mostActive.slice((page - 1) * 10,page * 10);
  }

  getDetails(id:string): void{
    this.router.navigate(['board-game-details', {my_object: id}] )
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

    this.searchService.getBoardGameByName(this.searchValue).subscribe(result=>{
      const temp:MostActive[] = this.searchService.parseGetBoardGameByName(result.toString());
      required = temp.length;
      this.mostActive = [];

      for(let count = 0; count < temp.length; count++){
        this.searchService.getBoardGameById(temp[count].id).subscribe(result=>{
          retrieved++;
          this.mostActive.push(this.searchService.parseGetBoardGameById(result));

          if(retrieved == required){
            this.contentType = this.mostActive.length + " Result" + (this.mostActive.length == 1 ? "" : "s");
            this.sort();
            this.ngOnInit();
          }
        },error =>{
          console.log(error);
          retrieved++;
          if(retrieved == required){
            this.contentType = this.mostActive.length + " Result" + (this.mostActive.length == 1 ? "" : "s");
            this.sort();
            this.ngOnInit();
          }
        });
      }
    })
  }

}
