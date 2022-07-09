import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { comment,empty } from '../../shared/models/comment';
import { script } from '../../shared/models/script';
import { CommentService } from '../../shared/services/comments/comment.service';
import { ScriptService } from '../../shared/services/scripts/script.service';

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

  constructor(private readonly commentService:CommentService){
    console.log("comment-component");
  }

  ngOnInit(): void {
    console.log("comment");
    console.log(this.currentComment);

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
  }

  toggleReplyForm(): void{
    this.showReplyForm = !this.showReplyForm;
  }

  toggleReplies(): void{
    this.showReplies = !this.showReplies;
  }

  addNewReply(value:comment): void{
    this.commentService.addReply(this.currentComment._id,value._id);
    this.replies.unshift(value);
    
    this.showReplyForm = false;
    this.showReplies = true;
    this.incrementCommentCounter.emit();
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
        temp = today.getDay() - current.getDay();
        
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
