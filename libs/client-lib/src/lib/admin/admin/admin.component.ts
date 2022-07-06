import { Component, OnInit } from '@angular/core';
import { AdminService } from '../admin-service/admin.service';
import { ActivatedRoute, Router } from '@angular/router';
// import { StringMap } from '@angular/compiler/src/compiler_facade_interface';


// import { TestPassService } from '../../test-pass.service';
// import { Router } from '@angular/router';

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
  public scripts : any;

  constructor(private adminService: AdminService, private router:Router, private route: ActivatedRoute) {}
  
  onEdit(filename: string, id: string): void{
    console.log("this works okay");
    this.router.navigate(['editor'],{state: {id, filename}});
  }

  ngOnInit(): void {
 
    if(this.scripts==null){
      
      this.adminService.getScripts().subscribe(data=>{
        const date = new Date();
        const month = date.toLocaleString('default', { month: 'long' });
        this.scripts = data.filter( (res: { created: string | string[]; }) => res.created.indexOf(month)>0);
        this.currentPub = this.scripts.length;
        this.scripts = data.filter( (res: { status: { value: number; }; }) => res.status.value===2);
        this.Active = this.scripts.length;
        this.scripts = data.filter( (res: { status: { value: number; }; }) => res.status.value===1);
        this.InProgress = this.scripts.length;
        this.scripts = data.filter( (res: { status: { value: number; }; }) => res.status.value===0);
        this.Flagged = this.scripts.length;

        this.scripts = data;
        this.totalPub = this.scripts.length;
        for(let i=0; i < this.scripts.length; i++){
          const date = this.scripts[i].created.split(" ");
  
          this.scripts[i].created = [date[3], date[1], date[2]].join("-");
        }
      });
    }
  }

  findAll(): void{
    this.adminService.getScripts().subscribe(data=>{

      this.scripts = data;
      for(let i=0; i < this.scripts.length; i++){
        const date = this.scripts[i].created.split(" ");

        this.scripts[i].created = [date[3], date[1], date[2]].join("-");
      }
    });
  }
  currentMonth(): void{

    this.adminService.getScripts().subscribe(data=>{

      const date = new Date();
  
      const month = date.toLocaleString('default', { month: 'long' });

      this.scripts = data.filter( (res: { created: string | string[]; }) => res.created.indexOf(month)>0);

      for(let i=0; i < this.scripts.length; i++){
        const date = this.scripts[i].created.split(" ");
        console.log(date);
        this.scripts[i].created = [date[3], date[1], date[2]].join("-");
      }
      
      this.ngOnInit();
    });

  }

  runningScripts(): void{

    this.adminService.getScripts().subscribe(data=>{

      this.scripts = data.filter( (res: { status: { value: number; }; }) => res.status.value===2);

      for(let i=0; i < this.scripts.length; i++){
        const date = this.scripts[i].created.split(" ");

        this.scripts[i].created = [date[3], date[1], date[2]].join("-");
      }
      this.ngOnInit();
    });
    
  }

  flaggedScripts(): void{
    this.adminService.getScripts().subscribe(data=>{
      
      this.scripts = data.filter( (res: { status: { value: number; }; }) => res.status.value===0);

      for(let i=0; i < this.scripts.length; i++){
        const date = this.scripts[i].created.split(" ");

        this.scripts[i].created = [date[3], date[1], date[2]].join("-");
      }
      this.ngOnInit();
    });
  }

  ProgressScripts(): void{
    this.adminService.getScripts().subscribe(data=>{
      
      this.scripts = data.filter( (res: { status: { value: number; }; }) => res.status.value===1);
      for(let i=0; i < this.scripts.length; i++){
        const date = this.scripts[i].created.split(" ");

        this.scripts[i].created = [date[3], date[1], date[2]].join("-");
      }
      this.ngOnInit();
    });
  }
}
