import { Component, Input, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { comment } from '../../shared/models/comments/comment';
import { CommentService } from '../../shared/services/comments/comment.service';
import { ReportService } from '../../shared/services/reports/report.service';
import { GoogleAuthService } from '../../google-login/GoogleAuth/google-auth.service';
import { NotificationComponent } from '../../shared/components/notification/notification.component';
import { report } from '../../shared/models/scripts/report';
import { user } from '../../shared/models/general/user';
import { AdminService } from '../../shared/services/admin/admin.service';
import { ScriptService } from '../../shared/services/scripts/script.service';
import { Router } from '@angular/router';
import { automataScript } from '../../shared/models/scripts/automata-script';
import { oldScript } from '../../shared/models/scripts/old-script';
import { myScript } from '../../shared/models/scripts/my-script';

@Component({
  selector: 'board-game-companion-app-report-form',
  templateUrl: './report-form.component.html',
  styleUrls: ['./report-form.component.scss'], 
})
export class ReportFormComponent{
  @Input() current!:report;
  @Input() index = 0;
  @Output() removeEvent = new EventEmitter<string>()
  @ViewChild(NotificationComponent,{static:true}) notifications: NotificationComponent = new NotificationComponent();
  months: string[] = ["January","February","March","April","May","June","July","August","September","October","November","December"];

  constructor(private readonly reportService:ReportService,
    private readonly scriptService:ScriptService,
    private router: Router) {}

  formatDate(date:Date):string{
    let result = "";
    
    const val = new Date(date);

    result = (val.getDate() < 10 ? "0": "") + val.getDate() + " ";
    result += this.months[val.getMonth()] + " ";
    result += val.getFullYear() + ", ";
    result += (val.getHours() < 10 ? "0" : "") + val.getHours() + ":" + (val.getMinutes() < 10 ? "0" : "") + val.getMinutes() + ":" + (val.getSeconds() < 10 ? "0" : "") + val.getSeconds();

    return result;
  }

  ignore(value:report): void{
    this.reportService.remove(value._id).subscribe({
      next:(response:report) => {
        if(response === null){
          this.notifications.add({type:"warning",message:"Report could not be found"});
          return;
        }

        this.notifications.add({type:"success",message:"Successfully removed report"});
        this.removeEvent.emit(value._id)
      },
      error:() => {
        this.notifications.add({type:"danger",message:"Failed to remove report."});
      }
    })
  }


  view(value:report): void{
    this.scriptService.getAutomataById(value.link).subscribe({
      next:(response:automataScript | oldScript)=>{
        if(response === null){
          this.notifications.add({type:"warning",message:"Could not find script on the server"});
          return;
        }
        const temp  = response as automataScript;

        if(temp.link === undefined){
          this.notifications.add({type:"warning",message:"This script has already been updated"});
          return;
        }

        this.scriptService.getMyScriptById(temp.link).subscribe({
          next:(response:myScript) => {
            if(response === null){
              this.notifications.add({type:"warning",message:"Could not find script on the server"});
              return;
            }
            
            
            this.router.navigate(['editor'],{ state: { value: response } });
          },
          error:()=>{
            this.notifications.add({type:"danger",message:"Failed to load script"});
          }
        })
      },
      error:()=>{
        this.notifications.add({type:"danger",message:"Failed to load script"});
      }
    })
  }

  flag(value:report): void{
    this.reportService.flag(value._id).subscribe({
      next:()=>{
        this.notifications.add({type:"success",message:"Successfully flagged " + (value.script ? "script" : "comment")})
        this.removeEvent.emit(value._id);
      },
      error:()=>{
        this.notifications.add({type:"danger",message:"Failed to flag " + (value.script ? "script" : "comment")})
      }
    })
  }
}
