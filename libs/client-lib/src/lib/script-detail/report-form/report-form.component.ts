import { Component, Input, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { comment } from '../../shared/models/comment';
import { CommentService } from '../../shared/services/comments/comment.service';
import { script } from '../../shared/models/script';
import { GoogleAuthService } from '../../google-login/GoogleAuth/google-auth.service';
import { NotificationComponent } from '../../shared/components/notification/notification.component';

@Component({
  selector: 'board-game-companion-app-report-form',
  templateUrl: './report-form.component.html',
  styleUrls: ['./report-form.component.scss'], 
})
export class ReportFormComponent implements OnInit {
  @ViewChild(NotificationComponent,{static:true}) notifications: NotificationComponent = new NotificationComponent();
  content = "";
  

  constructor(private readonly commentService:CommentService, private readonly gapi: GoogleAuthService) {}

  ngOnInit(): void {
    console.log("comment-form");
  }

  onEnter(value:any): void{
    if(value.key === "Enter"){
      value?.preventDefault();
      this.send();
    }
  }

  send(): void{
    if(!this.gapi.isLoggedIn()){
      this.notifications.add({type:"primary",message:"You must be logged In to report on the script."});
      return;
    }

    
  }

  clear(): void{
    this.content = "";
  }
}
