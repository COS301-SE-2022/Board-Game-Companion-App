import { Component, OnInit } from '@angular/core';
import { AdminService } from '../admin-service/admin.service';
import { ActivatedRoute, Router } from '@angular/router';
// import { StringMap } from '@angular/compiler/src/compiler_facade_interface';
import { script } from '../../shared/models/scripts/script';
import { user } from '../../shared/models/general/user';
import { report } from '../../shared/models/scripts/report';
// import { TestPassService } from '../../test-pass.service';
import { ReportService } from '../../shared/services/reports/report.service';
import { ScriptService } from '../../shared/services/scripts/script.service';

@Component({
  selector: 'board-game-companion-app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
})
export class AdminComponent implements OnInit {

  public currentPub = 0 ; // Total number of scripts posted this month.
  public totalPub = 0 ; // Total number of scripts.
  public Flagged = 0 ; // Total number of flagged scripts.
  public InProgress = 0; // Total number of scripts In progress.
  public Active = 0; // Total number of current running scripts.
  public Reports = 0;

  public page = 1;
  public search = "";
  public scripts:script[] = [];
  public months:string[] = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  public reports:report[] = [];
  public selected = "";
  public searchedValue = "";

  constructor(
    private adminService: AdminService,
    private router:Router, 
    private route: ActivatedRoute, 
    private reportService:ReportService,
    private scriptService:ScriptService) {}
  
  onEdit(filename: string, id: string): void{
    console.log("this works okay");
    this.router.navigate(['editor',{id, filename}]);
  }
  
  onInfo(filename:string, id: string): void {
    console.log(" Comment on script: "+id);
    this.router.navigate(['script-detail',{id, filename}]);
  }

  onRemove(id:string): void{
    console.log("Admin removed");
  }

  ngOnInit(): void {
 
    if(this.scripts.length===0){
      
      this.adminService.getScripts().subscribe(data=>{
        const date = new Date();
        // const month = date.toLocaleString('default', { month: 'long' });
        this.scripts = data.filter( (res: { created: string | string[]; }) => {
          const d = new Date(res.created.toString());
          return d.getMonth()===date.getMonth();
        });
        this.currentPub = this.scripts.length;
        this.scripts = data.filter( (res: { status: { value: number; }; }) => res.status.value===2);
        this.Active = this.scripts.length;
        this.scripts = data.filter( (res: { status: { value: number; }; }) => res.status.value===1);
        this.InProgress = this.scripts.length;
        this.scripts = data.filter( (res: { status: { value: number; }; }) => res.status.value===0);
        this.Flagged = this.scripts.length;

        this.scripts = data;
        this.totalPub = this.scripts.length;
      });

      this.reportService.getAll().subscribe({
        next:(data)=>{
          this.reports = data;
          this.Reports = this.reports.length;
        },
        error:(e)=>{
          console.log(e);
        }
      });
    }
  }

  findAll(): void{
    this.adminService.getScripts().subscribe(data=>{

      this.scripts = data;
    });
  }
  currentMonth(): void{

    this.adminService.getScripts().subscribe(data=>{

      const date = new Date();
  
      // const month = date.toLocaleString('default', { month: 'long' });

      this.scripts = data.filter( (res: { created: string | string[]; }) => {
        const d = new Date(res.created.toString());
        return d.getMonth()===date.getMonth();
      });
      
      // this.ngOnInit();
    });

  }

  runningScripts(): void{

    this.adminService.getScripts().subscribe(data=>{

      this.scripts = data.filter( (res: { status: { value: number; }; }) => res.status.value===2);

      // this.ngOnInit();
    });
    
  }

  flaggedScripts(): void{
    this.adminService.getScripts().subscribe(data=>{
      
      this.scripts = data.filter( (res: { status: { value: number; }; }) => res.status.value===0);

      // this.ngOnInit();
    });
  }

  ProgressScripts(): void{
    this.adminService.getScripts().subscribe(data=>{
      
      this.scripts = data.filter( (res: { status: { value: number; }; }) => res.status.value===1);
      // this.ngOnInit();
    });
  }

  onSearch(): void{
    this.scripts = [];
    console.log(this.searchedValue);
    this.adminService.getScripts().subscribe(data=>{
      console.log(this.searchedValue);
      this.scripts = data.filter( (res: {name: string;}) => res.name.toLowerCase().includes(this.searchedValue.toLowerCase()));

    });
  }

  onSort(): void{
    if(this.selected==="alphabetical" && this.scripts.length!==0){

      this.scripts.sort(function(resultA: { name: string; }, resultB: { name: string; })
      {
        const nameA = resultA.name.toUpperCase(); // ignore upper and lowercase
        const nameB = resultB.name.toUpperCase(); // ignore upper and lowercase

        if (nameA < nameB) 
        {
          return -1;
        }
        if (nameA > nameB)
        {
          return 1;
        }

        return 0;
      });
    }
    else if(this.selected==="date" && this.scripts.length!==0)
    {
      this.scripts.sort(function(resultA: { created: any; }, resultB: { created: any; }) 
      {
        const dateA = resultA.created; 
        const dateB = resultB.created;

        return +new Date(dateA) - +new Date(dateB);
      });
    }
  }

  formatDate(date:Date):string{
    date = new Date(date);
    const formated = ("0"+date.getDate()).slice(-2) +" "+ this.months[date.getMonth()] +" "+ date.getFullYear();
    return formated;
  }

  ReportedScripts():void{
    const temp:script[]=[];
    for(let i=0; i < this.reports.length;i++){
      this.scriptService.getScriptById(this.reports[i].script).subscribe({
        next:(data)=>{
          temp.push(data);
        },
        error:(e)=>{
          console.log(e);
        }
      });
    }

    this.scripts = temp;
  }
}
