import { Component, OnInit } from '@angular/core';
import { script, empty } from '../../shared/models/script';
import { ScriptService } from '../../shared/services/scripts/script.service';
import { BggSearchService } from '../../shared/services/bgg-search/bgg-search.service';

@Component({
  selector: 'board-game-companion-app-script-detail',
  templateUrl: './script-detail.component.html',
  styleUrls: ['./script-detail.component.scss'],
})
export class ScriptDetailComponent implements OnInit {
  current:script = empty;
  months:string[] = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  boardGameName = "";

  constructor(private readonly scriptService:ScriptService,private readonly boardGameService:BggSearchService) {
  }

  ngOnInit(): void {
    const item = localStorage.getItem("script-detail") || JSON.stringify(empty);
    this.current = JSON.parse(item);  
  }

  replaceBackSlash(input:string):string{
    let result = "";

    for(let count = 0; count < input.length; count++){
      if(input[count] === "\\")
        result += "/";
      else
        result += input[count];
    }
    return result;
  }

  
  getBoardGameName(){
    this.boardGameService.getBoardGameById(this.current.boardgame).subscribe({
      next:(val)=>{
        this.boardGameName = this.boardGameService.parseGetBoardGameById(val.toString()).name;
      },
      error:(err)=>{
        console.log(err);
      }
    });
  }

  formatDate(date:Date):string{
    let result = "";
    
    const val = new Date(date);

    result = val.getDate() + " ";
    result += this.months[val.getMonth()] + " ";
    result += val.getFullYear() + ", ";
    result += val.getHours() + ":" + val.getMinutes() + ":" + val.getSeconds();

    return result;
  }
}
