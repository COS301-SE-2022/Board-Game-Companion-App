import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationComponent } from '../../shared/components/notification/notification.component';
import { automataScript } from '../../shared/models/scripts/automata-script';
import { myScript } from '../../shared/models/scripts/my-script';
import { oldScript } from '../../shared/models/scripts/old-script';
import { report } from '../../shared/models/scripts/report';
import { ReportService } from '../../shared/services/reports/report.service';
import { ScriptService } from '../../shared/services/scripts/script.service';

@Component({
  selector: 'board-game-companion-app-admin-reports',
  templateUrl: './admin-reports.component.html',
  styleUrls: ['./admin-reports.component.scss'],
})
export class AdminReportsComponent implements OnInit {
  @ViewChild(NotificationComponent,{static:true}) notifications: NotificationComponent = new NotificationComponent();
  reports:report[] = [];
  months: string[] = ["January","February","March","April","May","June","July","August","September","October","November","December"];

  constructor(private readonly reportService:ReportService,
              private readonly scriptService:ScriptService,
              private router: Router){}

  ngOnInit(): void {
    this.loadReports();
  }

  loadReports(): void{
    this.reportService.getAll().subscribe({
      next:(response:report[])=>{
        this.reports = response;
      },error:()=>{
        this.notifications.add({type:"danger",message:"Failed to load reports."})
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

  enumerate(x:number): number[]{
    const result:number[] = [];

    for(let count = 0; count < x; count++)
      result.push(count);

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
        this.reports = this.reports.filter((val:report) => val._id !== value._id);
      },
      error:() => {
        this.notifications.add({type:"danger",message:"Failed to remove report."});
      }
    })
  }


  view(value:report): void{
    this.scriptService.getAutomataById(value.script).subscribe({
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
}
