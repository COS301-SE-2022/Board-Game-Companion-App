import { Component, OnInit } from '@angular/core';
import { script, empty } from '../../shared/models/script';
import { ScriptService } from '../../shared/services/scripts/script.service';
import { BggSearchService } from '../../shared/services/bgg-search/bgg-search.service';
import { Router } from '@angular/router';

@Component({
  selector: 'board-game-companion-app-script-detail',
  templateUrl: './script-detail.component.html',
  styleUrls: ['./script-detail.component.scss'],
})
export class ScriptDetailComponent implements OnInit {
  _id = "62c19fffe801724a44a90106";
  current: script = empty;
  months: string[] = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  boardGameName = "";

  constructor(private readonly scriptService:ScriptService,private readonly boardGameService:BggSearchService, private readonly router:Router) {
  }

  ngOnInit(): void { 
    this.scriptService.getScriptById(this._id).subscribe({
      next:(value)=>{
        this.current = value;
      },
      error:(e)=>{
        console.log(e)
      },
      complete:()=>{
        console.log("complete")
      }          
    }); 
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

  play()
  {
    const id = this.current._id
    this.router.navigate(['scriptExecutor', {my_object: id}]);
  }
}
