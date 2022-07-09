import { Component, OnInit } from '@angular/core';
import { script, empty } from '../../shared/models/script';
import { ScriptService } from '../../shared/services/scripts/script.service';
import { BggSearchService } from '../../shared/services/bgg-search/bgg-search.service';
import { Router } from '@angular/router';
import { CommentService } from '../../shared/services/comments/comment.service';

@Component({
  selector: 'board-game-companion-app-script-detail',
  templateUrl: './script-detail.component.html',
  styleUrls: ['./script-detail.component.scss'],
})
export class ScriptDetailComponent implements OnInit {
  _id = "62c571451aad0198cf88306b";
  current: script = empty;
  months: string[] = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  boardGameName = "";
  showComments = false;
  numberOfComments = 0;

  constructor(private readonly scriptService:ScriptService,
    private readonly boardGameService:BggSearchService,
    private readonly commentService:CommentService,
    private readonly router:Router) {
  }

  ngOnInit(): void { 
    this.scriptService.getScriptById(this._id).subscribe({
      next:(value)=>{
        this.current = value;
		    this.getBoardGameName();
        this.countComments();
      },
      error:(e)=>{
        console.log(e)
      },
      complete:()=>{
        console.log("complete")
      }          
    }); 
  }

  toggleComments(){
    this.showComments = !this.showComments;
  }

  
  getBoardGameName():void{
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

  incrementCommentCounter(): void{
    this.numberOfComments++;
  }

  play(){
    const id = this.current._id
    this.router.navigate(['scriptExecutor', {my_object: id}]);
  }

  countComments(): void{
    this.commentService.countComments(this.current._id).subscribe({
      next:(value)=>{
        this.numberOfComments = value;
      },
      error:(e)=>{
        console.log(e)
      },
      complete:()=>{
        console.log("complete")
      }          
    });
  }
}
