import { Component, OnInit } from '@angular/core';
import { AdminService } from '../admin-service/admin.service';
import { ActivatedRoute, Router } from '@angular/router';
import { automataScript } from '../../shared/models/scripts/automata-script';
import { report } from '../../shared/models/scripts/report';
import { ReportService } from '../../shared/services/reports/report.service';
import { myScript } from '../../shared/models/scripts/my-script';

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
  public Reports = 0; // Total number of reports.

  public page = 1;
  public search = "";
  public scripts:automataScript[] = [];
  public inProgressScripts:myScript[]=[];
  public currentScript: automataScript = new automataScript;
  public months:string[] = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  public reports:report[] = [];
  public selected = "";
  public searchedValue = "";
  public viewAuto = true;
  public viewMines = true;
  public viewReports = false;
  public card = 2;

  constructor(
    private adminService: AdminService,
    private router:Router, 
    private route: ActivatedRoute, 
    private reportService:ReportService) {}
  
  onMyEdit(script:myScript): void{
    this.router.navigate(['editor'],{ state: { value: script } });
  }
  
  onMyInfo(script:myScript): void {
    this.router.navigate(['script-detail'],{ state: { value: script } });
  }

  onMyRemove(script:myScript): void{
    // this.router.navigate(['editor'],{ state: { value: script } });
  }

  ngOnInit(): void {
     
    this.adminService.getScripts().subscribe(data=>{
      const date = new Date();
      let temp:automataScript[]=[];
      this.scripts = data;
      temp = data.filter( (res: { dateReleased: Date; }) => {
        const d = new Date(res.dateReleased.toString());
        return d.getMonth()===date.getMonth();
      });

      this.currentPub = temp.length;
      this.Active = this.scripts.length;
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

    let temp : myScript[] = [];
    this.adminService.getUserOwnedScripts().subscribe(data=>{
        
    temp = data.filter( (res: { status: { value: number; }; }) => res.status.value===1);
    this.inProgressScripts = temp;
    this.InProgress = temp.length;
    this.totalPub = this.InProgress + this.Active;
    });

  }

  findAll(): void{
    this.adminService.getScripts().subscribe({
      next:(data)=>{
        this.scripts = data;
        this.viewMines = true;
        this.viewAuto = true;
        this.viewReports = false;
        this.card = 2;
      },
      error:(e)=>{
        console.log(e);
      }
    });
  }

  currentMonth(): void{
    this.adminService.getScripts().subscribe({
      next:(data)=>{
        const date = new Date();
  
          this.scripts = data.filter( (res: { dateReleased: Date; }) => {
          const d = new Date(res.dateReleased.toString());
          return d.getMonth()===date.getMonth();
        });
        this.viewAuto = true;
        this.viewMines = false;
        this.viewReports = false;
        this.card = 1;
      },
      error:(e)=>{
        console.log(e);
      }
    });
  }

  runningScripts(): void{
    this.adminService.getScripts().subscribe({
      next:(data)=>{
        this.scripts = data;
        console.log(this.scripts);
        this.viewAuto = true;
        this.viewMines = false;
        this.viewReports = false;
        this.card = 3;
      },
      error:(e)=>{
        console.log(e);
      }
    });
    
  }

  ProgressScripts(): void{
    let temp : myScript[] = [];
    this.adminService.getUserOwnedScripts().subscribe({
      next:(data)=>{
        temp = data.filter( (res: { status: { value: number; }; }) => res.status.value===1);

        this.inProgressScripts = temp;
        this.viewAuto = false;
        this.viewMines = true;
        this.viewReports = false;
        this.card = 5; 
      },
      error:(e)=>{
        console.log(e);
      }
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

  formatDate(date:Date):string{
    date = new Date(date);
    const formated = ("0"+date.getDate()).slice(-2) +" "+ this.months[date.getMonth()] +" "+ date.getFullYear();
    return formated;
  }

  ReportedScripts():void{
    this.scripts = [];
    this.card = 4; 
    for(let i=0; i < this.reports.length;i++){
      this.adminService.getScriptById(this.reports[i].script).subscribe({
        next:(data)=>{
          if(data!==null){
            this.scripts.push(data);
            console.log(data);
            this.viewAuto = false;
            this.viewMines = false;
            this.viewReports = true;
          }
        },
        error:(e)=>{
          console.log(e);
        }
      });
    }
  }
  onAutoEdit(script:automataScript): void{
    this.router.navigate(['editor'], { state: { value: script } });
  }
  
  onAutoInfo(script:automataScript): void {
    this.router.navigate(['script-detail'], { state: { value: script } });
  }

  onAutoRemove(script:automataScript): void{
    // this.router.navigate([''], { state: { value: script } });
  }

  Ignore(repo:report): void{
   this.reportService.remove(repo._id).subscribe({next:(result)=>{
    console.log(repo._id);
    console.log(result);
   },error:(e)=>{
    console.log(e);
   }})
  }
}
