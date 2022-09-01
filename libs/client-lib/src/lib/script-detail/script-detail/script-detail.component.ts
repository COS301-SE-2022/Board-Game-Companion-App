import { Component, OnInit,ViewChild } from '@angular/core';
import { script, empty } from '../../shared/models/script';
import { ScriptService } from '../../shared/services/scripts/script.service';
import { BggSearchService } from '../../shared/services/bgg-search/bgg-search.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommentService } from '../../shared/services/comments/comment.service';
import { rating } from '../../shared/models/rating';
import { NotificationComponent } from '../../shared/components/notification/notification.component';
import { GoogleAuthService } from '../../google-login/GoogleAuth/google-auth.service';

@Component({
  selector: 'board-game-companion-app-script-detail',
  templateUrl: './script-detail.component.html',
  styleUrls: ['./script-detail.component.scss'],
})
export class ScriptDetailComponent implements OnInit {
  current: script = empty;
  months: string[] = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  boardGameName = "";
  showComments = true;
  numberOfComments = 0;
  rate:rating = {_id:"",user:{name:"",email:""},script:"",value:0};
  averageRating = 0;
  voterCount = 0;
  downloading = false;
  @ViewChild(NotificationComponent,{static:true}) notifications: NotificationComponent = new NotificationComponent();

  constructor(private readonly scriptService:ScriptService,
    private readonly boardGameService:BggSearchService,
    private readonly commentService:CommentService,
    private readonly router:Router,
    private route: ActivatedRoute,
    private readonly gapi: GoogleAuthService
    ) {
      this.current = this.router.getCurrentNavigation()?.extras.state?.['value'];
      
  }

  ngOnInit(): void {

    if(this.current !== null || this.current !== undefined){
      this.getBoardGameName();
      this.countComments();
      this.getRating();
      this.getAverageRating();
      this.getVoterCount();
    } 
  }

  download(): void{
    if(!this.gapi.isLoggedIn()){
      this.notifications.add({type:"primary",message:"You must be logged In to download this script."});
      return;
    }

    this.downloading = true;
    this.scriptService.download(this.current._id,{name:sessionStorage.getItem("name") as string,email:sessionStorage.getItem("email") as string}).subscribe({
      next:(val)=>{
        this.downloading = false;
        this.notifications.add({type:"primary",message:val.message});

      },
      error:(err)=>{     
        this.downloading = false;
        console.log(err);
        this.notifications.add({type:"danger",message:"Something went wrong when downloading the script. If this error persists, contact the administrator"})
      }      
    });
  }

  convertBytes(value:number): string{
    const decimals = 2;
    const kilo = 1024;
    const deci = decimals < 0 ? 0 : decimals;
    const ranges = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    if(value === 0)
      return '0 B';
    const i = Math.floor(Math.log(value) / Math.log(kilo));

    return parseFloat((value / Math.pow(kilo, i)).toFixed(deci)) + ' ' + ranges[i];
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
    this.scriptService.getRating({name:sessionStorage.getItem("name") as string,email:sessionStorage.getItem("email") as string},this.current._id).subscribe({
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
    if(!this.gapi.isLoggedIn()){
      this.notifications.add({type:"primary",message:"You must be logged In to rate the script."});
      return;
    }

    this.scriptService.rate({name:sessionStorage.getItem("name") as string,email:sessionStorage.getItem("email") as string},this.current._id,val).subscribe({
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

    result = (val.getDate() < 10 ? "0": "") + val.getDate() + " ";
    result += this.months[val.getMonth()] + " ";
    result += val.getFullYear() + ", ";
    result += (val.getHours() < 10 ? "0" : "") + val.getHours() + ":" + (val.getMinutes() < 10 ? "0" : "") + val.getMinutes() + ":" + (val.getSeconds() < 10 ? "0" : "") + val.getSeconds();

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
