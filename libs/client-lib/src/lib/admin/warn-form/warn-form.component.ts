import { Component, Input, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { comment } from '../../shared/models/comments/comment';
import { CommentService } from '../../shared/services/comments/comment.service';
import { ReportService } from '../../shared/services/reports/report.service';
import { GoogleAuthService } from '../../google-login/GoogleAuth/google-auth.service';
import { NotificationComponent } from '../../shared/components/notification/notification.component';
import { report } from '../../shared/models/scripts/report';
import { user } from '../../shared/models/general/user';
import { AdminService } from '../../shared/services/admin/admin.service';

@Component({
  selector: 'board-game-companion-app-warn-form',
  templateUrl: './warn-form.component.html',
  styleUrls: ['./warn-form.component.scss'], 
})
export class ReportFormComponent{
  @Input() user!:user;
  @Output() reportEvent = new EventEmitter();
  @ViewChild(NotificationComponent,{static:true}) notifications: NotificationComponent = new NotificationComponent();
  content = "";
  
  constructor(private readonly adminService:AdminService) {}

  onEnter(value:any): void{
    if(value.key === "Enter"){
      value?.preventDefault();
      this.send();
    }
  }

  send(): void{
    this.adminService.warn(this.user,this.content).subscribe({
      next:() => {
        this.notifications.add({type:'success',message:"Warning was successfully sent."});
      },
      error:() => {
        this.notifications.add({type:"danger",message:"Failed to send warning."});
      }
    })
    
  }

  clear(): void{
    this.content = "";
  }
}
