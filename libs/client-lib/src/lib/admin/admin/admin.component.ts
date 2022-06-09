import { Component, OnInit } from '@angular/core';
import { AdminService } from '../admin-service/admin.service';
import { ActivatedRoute, Router } from '@angular/router';


// import { TestPassService } from '../../test-pass.service';
// import { Router } from '@angular/router';

@Component({
  selector: 'board-game-companion-app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
})
export class AdminComponent implements OnInit {

  // private name: string;
  public scripts : any;

  constructor(private adminService: AdminService, private router:Router, private route: ActivatedRoute) {}
  
  onEdit(): void{
    console.log("this works okay");
    this.router.navigate(['editor'],{state: {filename:'Root', author:'default'}});
  }

  ngOnInit(): void {
 
    if(this.scripts==null){
      this.adminService.getScripts().subscribe(data=>{
        this.scripts = data;
        for(let i=0; i < this.scripts.length; i++){
          const date = this.scripts[i].created.split(" ");
  
          this.scripts[i].created = [date[3], date[1], date[2]].join("-");
        }
        // console.log(this.scripts);
      });
    }
    // console.log(this.scripts);
  }

  findAll(): void{
    this.adminService.getScripts().subscribe(data=>{

      this.scripts = data;
      for(let i=0; i < this.scripts.length; i++){
        const date = this.scripts[i].created.split(" ");

        this.scripts[i].created = [date[3], date[1], date[2]].join("-");
      }
      // console.log(this.scripts);
    });
  }
  currentMonth(): void{

    this.adminService.getScripts().subscribe(data=>{

      const date = new Date();
  
      const month = date.toLocaleString('default', { month: 'long' });

      this.scripts = data.filter( (res: { created: string | string[]; }) => res.created.indexOf(month)>0);
      this.scripts = data;
      for(let i=0; i < this.scripts.length; i++){
        const date = this.scripts[i].created.split(" ");

        this.scripts[i].created = [date[3], date[1], date[2]].join("-");
      }
      
      this.ngOnInit();
    });

  }

  runningScripts(status:string): void{

    this.adminService.getScripts().subscribe(data=>{

      this.scripts = data.filter( (res: { status: { value: number; }; }) => res.status.value===2);
      // this.scripts = data;
      for(let i=0; i < this.scripts.length; i++){
        const date = this.scripts[i].created.split(" ");

        this.scripts[i].created = [date[3], date[1], date[2]].join("-");
      }
      this.ngOnInit();
    });
    
  }

  flaggedScripts(status:string): void{
    this.adminService.getScripts().subscribe(data=>{
      
      this.scripts = data.filter( (res: { status: { value: number; }; }) => res.status.value===0);
      // this.scripts = data;
      for(let i=0; i < this.scripts.length; i++){
        const date = this.scripts[i].created.split(" ");

        this.scripts[i].created = [date[3], date[1], date[2]].join("-");
      }
      this.ngOnInit();
    });
  }

  ProgressScripts(status:string): void{
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
