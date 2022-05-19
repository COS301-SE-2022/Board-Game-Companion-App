import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'board-game-companion-app-board-game-search-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss'],
})
export class PaginationComponent implements OnInit {

  left = 1;
  middle = 2;
  right = 3;
  current = 1;
  @Input() boardsPerPage = 0;
  @Input() numberOfBoardGames = 0;
  @Output() newPageEvent = new EventEmitter<number>();

  ngOnInit(): void {
    this.boardsPerPage = 10;
  }

  changePage(value:number): void{
    this.current = value;
    this.newPageEvent.emit(value);
    this.ngOnInit();
  }

  movePagination(left:boolean):void{
    if(left === true){
      if(this.left !== 1){
        this.left--;
        this.middle--;
        this.right--;

        if(this.current === (this.right + 1))
          this.changePage(this.middle);
      }
    }else{
      if(this.right !== Math.ceil(this.numberOfBoardGames / this.boardsPerPage)){
        this.left++;
        this.middle++;
        this.right++;

        if(this.current === (this.left - 1))
          this.changePage(this.middle);
      }
    }
  }

}
