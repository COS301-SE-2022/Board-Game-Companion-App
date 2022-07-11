import { Component, OnInit } from '@angular/core';
import { script, empty } from '../../shared/models/script';
import { ScriptService } from '../../shared/services/scripts/script.service';
import { BggSearchService } from '../../shared/services/bgg-search/bgg-search.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommentService } from '../../shared/services/comments/comment.service';
import { rating } from '../../shared/models/rating';

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
  showComments = true;
  numberOfComments = 0;
  rate:rating = {_id:"",user:"",script:"",value:0};
  averageRating = 0;
  voterCount = 0;

  constructor(private readonly scriptService:ScriptService,
    private readonly boardGameService:BggSearchService,
    private readonly commentService:CommentService,
    private readonly router:Router,
    private route: ActivatedRoute) {
  }

  ngOnInit(): void {

    if(this.route.snapshot.paramMap.get("id")!==null){
      this._id = this.route.snapshot.paramMap.get("id")||"";
    }
    
    this.scriptService.getScriptById(this._id).subscribe({
      next:(value)=>{
        this.current = value;
		    this.getBoardGameName();
        this.countComments();
        this.getRating();
        this.getAverageRating();
        this.getVoterCount();
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

  getRating(): void{
    this.scriptService.getRating("Joseph",this.current._id).subscribe({
      next:(val)=>{
        if(val !== null)
          this.rate = val;
      },
      error:(err)=>{
        console.log(err);
      }
    });
  }

  getAverageRating(): void{
    this.scriptService.averageRating(this.current._id).subscribe({
      next:(val)=>{
        this.averageRating = val;
      },
      error:(err)=>{
        console.log(err);
      }
    });   
  }

  getVoterCount(): void{
    this.scriptService.countRating(this.current._id).subscribe({
      next:(val)=>{
        this.voterCount = val;
      },
      error:(err)=>{
        console.log(err);
      }
    });      
  }

  rateScript(val:number): void{
    this.scriptService.rate("Joseph",this.current._id,val).subscribe({
      next:(val)=>{
        this.getAverageRating();
        this.getVoterCount();
        this.rate = val;
      },
      error:(err)=>{
        console.log(err);
      }      
    })
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
