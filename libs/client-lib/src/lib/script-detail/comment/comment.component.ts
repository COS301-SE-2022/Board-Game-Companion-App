import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { comment,empty } from '../../shared/models/comments/comment';
import { like } from '../../shared/models/comments/like';
import { commentCount } from '../../shared/models/comments/commentCount';
import { script } from '../../shared/models/scripts/script';
import { CommentService } from '../../shared/services/comments/comment.service';
import { ScriptService } from '../../shared/services/scripts/script.service';
import { OnlineStatusService, OnlineStatusType } from 'ngx-online-status';
import { GoogleAuthService } from '../../google-login/GoogleAuth/google-auth.service';
import { NotificationComponent } from '../../shared/components/notification/notification.component';

@Component({
  selector: 'board-game-companion-app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss'],
})
export class CommentComponent implements OnInit {
  @Input()width = 0;
  @Input()depth = 0;
  @Input()currentComment:comment = empty;
  @Input()script = "";
  @Output()incrementCommentCounter = new EventEmitter();
  replies:comment[] = [];
  showReplyForm = false;
  showReplies = false;
  count:commentCount = {likes: 0,dislikes: 0,replies: 0};
  likeStatus = -1;
  currentLike!:like;
  status: OnlineStatusType = OnlineStatusType.ONLINE;
  @ViewChild(NotificationComponent,{static:true}) notifications: NotificationComponent = new NotificationComponent();

  constructor(private readonly commentService:CommentService,
              private readonly networkService: OnlineStatusService,
              private readonly gapi: GoogleAuthService){

                this.networkService.status.subscribe((status: OnlineStatusType) =>{
                  this.status = status;
                });
  }

  ngOnInit(): void {

    this.commentService.getComments(this.currentComment.replies).subscribe({
      next:(value)=>{
        this.replies = value;
      },
      error:(e)=>{
        console.log(e)
      },
      complete:()=>{
        console.log("complete")
      }          
    });

    this.commentService.getLike(this.currentComment._id,{name:"Joseph",email:"u18166793@tuks.co.za"}).subscribe({
      next:(value)=>{
        if(value !== null){
          this.likeStatus = value.like ? 1 : 0;
          this.currentLike = value;
        }
      },
      error:(e)=>{
        console.log(e)
      },
      complete:()=>{
        console.log("complete")
      } 
    })

    this.getCount();
  }

  toggleReplyForm(): void{
    this.showReplyForm = !this.showReplyForm;
  }

  toggleReplies(): void{
    this.showReplies = !this.showReplies;
  }

  addNewReply(value:comment): void{
    this.commentService.addReply(this.currentComment._id,value._id).subscribe({
      next:(val)=>{
        this.replies.unshift(value);
        this.getCount();
        this.showReplyForm = false;
        this.showReplies = true;
        this.incrementCommentCounter.emit();
      },
      error:(e)=>{
        console.log(e)
      },
      complete:()=>{
        console.log("complete")
      }       
    });

  }

  like(value:number): void{
    if(this.status === OnlineStatusType.OFFLINE){
      this.notifications.add({type:"warning",message:"You must be online to like comment"});
      return;
    }

    if(!this.gapi.isLoggedIn()){
      this.notifications.add({type:"warning",message:"You must be logged in to like comment"})
      return;
    }

    if(value === this.likeStatus){
      this.commentService.removeLike(this.currentLike._id);
      this.getCount();
      this.likeStatus = -1;
    }else{
      this.commentService.like(this.currentComment._id,value === 0 ? false : true).subscribe({
        next:(val)=>{
          this.likeStatus = val.like ? 1 : 0;
          this.currentLike = val;
          this.getCount();
        },
        error:(e)=>{
          console.log(e)
        }         
      });
    }
  }

  getCount(): void{
    this.commentService.countlikes(this.currentComment._id).subscribe({
      next:(value)=>{
        this.count = value;
      },
      error:(e)=>{
        console.log(e)
      }        
    })
  }

  getTime(): string{
    let result = "";
    let temp = 0;
    const today = new Date(); 
    const current = new Date(this.currentComment.created);

    console.log(this.currentComment.created);

    temp = today.getFullYear() - current.getFullYear();

    if(temp !== 0){
      result = temp.toString() + " year" + (temp == 1 ? "" :"s") + " ago";
    }else{
      temp = today.getMonth() - current.getMonth();
      
      if(temp !== 0){
        result = temp.toString() + " month" + (temp == 1 ? "" :"s") + " ago";
      }else{
        temp = today.getDate() - current.getDate();

        if(temp !== 0){
          result = temp.toString() + " day" + (temp == 1 ? "" :"s") + " ago";
        }else{
          temp = today.getHours() - current.getHours();
          
          if(temp !== 0){
            result = temp.toString() + " hour" + (temp == 1 ? "" :"s") + " ago";
          }else{
            temp = today.getMinutes() - current.getMinutes();

            if(temp !== 0){
              result = temp.toString() + " minute" + (temp == 1 ? "" :"s") + " ago";
            }else{
              temp = today.getSeconds() - current.getSeconds();
              result = temp.toString() + " second" + (temp == 1 ? "" :"s") + " ago";
            }
          }
        }
      }
    }
    
    return result;
  }
}
