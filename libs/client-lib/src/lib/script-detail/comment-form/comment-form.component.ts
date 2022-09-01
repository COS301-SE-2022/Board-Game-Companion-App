import { Component, Input, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { comment } from '../../shared/models/comments/comment';
import { CommentService } from '../../shared/services/comments/comment.service';
import { script } from '../../shared/models/scripts/script';
import { GoogleAuthService } from '../../google-login/GoogleAuth/google-auth.service';
import { NotificationComponent } from '../../shared/components/notification/notification.component';

@Component({
  selector: 'board-game-companion-app-comment-form',
  templateUrl: './comment-form.component.html',
  styleUrls: ['./comment-form.component.scss'],
})
export class CommentFormComponent implements OnInit {
  @Input()script = "";
  @Input()formType = "";
  @Input()width = 0;
  @Output()newComment = new EventEmitter<comment>();
  @ViewChild(NotificationComponent,{static:true}) notifications: NotificationComponent = new NotificationComponent();
  content = "";
  

  constructor(private readonly commentService:CommentService, private readonly gapi: GoogleAuthService) {}

  ngOnInit(): void {
    console.log("comment-form");
  }

  onEnter(value:any): void{
    if(value.key === "Enter"){
      value?.preventDefault();
      this.recordComment();
    }
  }

  recordComment(): void{
    if(!this.gapi.isLoggedIn()){
      this.notifications.add({type:"primary",message:"You must be logged In to comment on the script."});
      return;
    }

    const formData: FormData = new FormData();
    formData.append("name",sessionStorage.getItem("name") as string);
    formData.append("image",sessionStorage.getItem("img") as string);
    formData.append("content",this.content);
    formData.append("script",this.script);

    this.commentService.saveComment(formData).subscribe({
      next:(value)=>{
        this.newComment.emit(value);
        this.clear();
      },
      error:(e)=>{
        console.log(e);
      },
      complete:()=>{
        console.log("complete")
      }      
  })
  }

  clear(): void{
    this.content = "";
  }
}
