import { Component, OnInit } from '@angular/core';
import { AdminService,scriptFace } from '../admin-service/admin.service';
// import { TestPassService } from '../../test-pass.service';
// import { Router } from '@angular/router';
@Component({
  selector: 'board-game-companion-app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
})
export class AdminComponent implements OnInit {

  // private name: string;
  scripts: scriptFace[]=[];

  constructor(private adminService: AdminService) {
  }

  ngOnInit(): void {
    // console.log(this.scripts.length);
    if(this.scripts.length==0){
      this.adminService.getScripts().subscribe(data=>{
        this.scripts = data;
        // console.log(this.scripts.length);
      });
    }
    // console.log(this.scripts[0].name);
  }
  findAll(): void{
    this.adminService.getScripts().subscribe(data=>{
      this.scripts = data;
      // console.log(this.scripts.length);
    });
  }
  currentMonth(): void{

    this.adminService.getScripts().subscribe(data=>{

      const date = new Date();
  
      const month = date.toLocaleString('default', { month: 'long' });

      this.scripts = data.filter( res => res.date.indexOf(month)>0);
      // for(let index=0; index<data.length; index++){
      //   if(data[index].date.indexOf(month)>0)
      //     this.scripts.push(data[index]);
      // }
      this.ngOnInit();
    });

  }

  runningScripts(status:string): void{

    this.adminService.getScripts().subscribe(data=>{

      this.scripts = data.filter( res => res.status==status);

      // for(let index=0; index<data.length; index++){
      //   if(data[index].status===status)
      //     this.scripts.push(data[index]);
      // }
      this.ngOnInit();
    });
    
  }

  flaggedScripts(status:string): void{
    this.adminService.getScripts().subscribe(data=>{
      
      this.scripts = data.filter( res => res.status==status);
      // for(let index=0; index<data.length; index++){
      //   if(data[index].status===status)
      //     this.scripts.push(data[index]);
      // }
      this.ngOnInit();
    });
  }

  // send(){
  //   this.testP.emit<string>('An essage from lover');
  //   this.router.navigate(['/collections']);
  // }
}