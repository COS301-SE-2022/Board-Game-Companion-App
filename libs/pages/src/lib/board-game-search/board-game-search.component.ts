import { Component, OnInit } from '@angular/core';
import { BggSearchService,MostActive } from '../bgg-search-service/bgg-search.service';

@Component({
  selector: 'board-game-companion-app-board-game-search',
  templateUrl: './board-game-search.component.html',
  styleUrls: ['./board-game-search.component.scss'],
})
export class BoardGameSearchComponent implements OnInit {
  mostActive:MostActive[] = [];
  contentType = "Most Active";
  searchValue = "";

  constructor(private readonly searchService:BggSearchService) {

  }

  ngOnInit(): void {
    if(this.mostActive.length == 0){
      this.searchService.getMostActive().subscribe(result =>{
        this.contentType = "Most Active";
        this.mostActive = this.searchService.parseMostActive(result.toString());
      });
    }
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
