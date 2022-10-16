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
  scriptReports:report[] = [];
  showScriptReports:report[] = [];
  commentReports:report[] = [];
  showCommentReports:report[] = [];
  scriptPage = 1;
  commentPage = 1;
  showComments = false;
  showScripts = true;
  months: string[] = ["None","January","February","March","April","May","June","July","August","September","October","November","December"];
  section = 0;
  year = (new Date()).getFullYear();
  month = this.months[(new Date()).getMonth()];

  constructor(private readonly reportService:ReportService,
              private readonly scriptService:ScriptService,
              private router: Router){}

  ngOnInit(): void {
    this.loadReports();
  }

  tab(value:number): void{
    this.section = value;
    this.scriptPage = 1;
    this.commentPage = 1;
  }

  getYears():number[]{
    const result:number[] = []
    const current = (new Date()).getFullYear();

    for(let count = 2022; count <= current; count++)
      result.push(count);

    return result;
  }

  removeScriptReport(id: string): void{
    this.showScriptReports = this.showScriptReports.filter((value:report) => value._id !== id)
    this.scriptReports = this.scriptReports.filter((value:report) => value._id !== id)
  }

  removeCommentReport(id: string): void{
    this.showCommentReports = this.showCommentReports.filter((value:report) => value._id !== id)
    this.commentReports = this.commentReports.filter((value:report) => value._id !== id)
  }

  filter(): void{
    this.showScriptReports = [];
    this.showCommentReports = [];

    this.scriptReports.forEach((value:report) => {
      const issued = new Date(value.dateIssued);

      if(issued.getFullYear() === this.year){
        if(this.month === "None" || this.months[issued.getMonth()] === this.month)
          this.showScriptReports.push(value)
      }
    })

    this.commentReports.forEach((value:report) => {
      const issued = new Date(value.dateIssued);

      if(issued.getFullYear() === this.year){
        if(this.month === "None" || this.months[issued.getMonth()] === this.month)
          this.showCommentReports.push(value)
      }
    })
  }

  loadReports(): void{
    this.reportService.getAll().subscribe({
      next:(response:report[])=>{
        console.log("length: " + response.length)
        this.showScriptReports = this.scriptReports = response.filter((value:report) => value.script);
        this.showCommentReports = this.commentReports = response.filter((value:report) => !value.script);
      },error:()=>{
        this.notifications.add({type:"danger",message:"Failed to load reports."})
      }
    })
  }


  enumerate(x:number): number[]{
    const result:number[] = [];

    for(let count = 0; count < x; count++)
      result.push(count);

    return result;
  }

}
