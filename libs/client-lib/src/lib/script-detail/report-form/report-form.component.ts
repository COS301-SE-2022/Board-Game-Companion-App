import { Component, Input, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { comment } from '../../shared/models/comments/comment';
import { CommentService } from '../../shared/services/comments/comment.service';
import { ReportService } from '../../shared/services/reports/report.service';
import { GoogleAuthService } from '../../google-login/GoogleAuth/google-auth.service';
import { NotificationComponent } from '../../shared/components/notification/notification.component';
import { report } from '../../shared/models/scripts/report';

@Component({
  selector: 'board-game-companion-app-report-form',
  templateUrl: './report-form.component.html',
  styleUrls: ['./report-form.component.scss'], 
})
export class ReportFormComponent implements OnInit {
  @Input() id = "";
  @Input() reported = false;
  @Output() reportEvent = new EventEmitter();
  @ViewChild(NotificationComponent,{static:true}) notifications: NotificationComponent = new NotificationComponent();
  content = "";
  

  constructor(private readonly commentService:CommentService,
              private readonly gapi: GoogleAuthService,
              private readonly reportService:ReportService) {}

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

    if(this.reported){
      this.notifications.add({type:"primary",message:"Your previous report has not been resolved yet."})
      return
    }

    this.reportService.report(this.id,this.content).subscribe({
      next:(value:report) => {
        this.content = "";
        this.reportEvent.emit();
      },
      error:(err) => {
        console.log(err);
        this.notifications.add({type:"danger",message:"Failed to report script.If this error persist, you can contact the administrator."});
      }
    })
    
  }

  clear(): void{
    this.content = "";
  }
}
