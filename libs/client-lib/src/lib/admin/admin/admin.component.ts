import { Component, OnInit } from '@angular/core';
import { AdminService } from '../admin-service/admin.service';
import { ActivatedRoute, Router } from '@angular/router';
// import { StringMap } from '@angular/compiler/src/compiler_facade_interface';
// import { script } from '../../shared/models/script';
import { user } from '../../shared/models/user';
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

  public page = 1;
  public search = "";
  public scripts : any;

  public selected = "";
  public searchedValue = "";

  constructor(private adminService: AdminService, private router:Router, private route: ActivatedRoute) {}
  
  onEdit(filename: string, id: string): void{
    console.log("this works okay");
    this.router.navigate(['editor',{id, filename}]);
  }
  
  onComment(filename:string, id: string): void {
    console.log(" Comment on script: "+id);
    this.router.navigate(['script-detail',{id, filename}]);
  }

  ngOnInit(): void {
 
    if(this.scripts==null){
      
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
  
      // const month = date.toLocaleString('default', { month: 'long' });

      this.scripts = data.filter( (res: { created: string | string[]; }) => {
        const d = new Date(res.created.toString());
        return d.getMonth()===date.getMonth();
      });

      for(let i=0; i < this.scripts.length; i++){
        const date = this.scripts[i].created.split(" ");
        // console.log(date);
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

  onSearch(): void{
    this.scripts = [];
    this.adminService.getScripts().subscribe(data=>{
      this.scripts = data.filter( (res: {name: string;}) => res.name.toLowerCase().includes(this.searchedValue.toLowerCase()));

      for(let i=0; i < this.scripts.length; i++){
        const date = this.scripts[i].created.split(" ");

        this.scripts[i].created = [date[3], date[1], date[2]].join("-");
      }
      // this.ngOnInit();
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
}
