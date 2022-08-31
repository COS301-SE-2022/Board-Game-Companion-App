import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { empty, script } from '../../shared/models/script';
import { DownloadsService } from '../../shared/services/downloads/downloads.service';
@Component({
  selector: 'board-game-companion-app-downloads-page',
  templateUrl: './downloads-page.component.html',
  styleUrls: ['./downloads-page.component.scss'],
})
export class DownloadsPageComponent implements OnInit {
  scripts: script[] = [];
  currentScript: script = empty;

  constructor(private readonly downloadsService:DownloadsService, private readonly router:Router) {}

  ngOnInit(): void {
    this.loadScripts();
  }

  loadScripts(): void{
    if(navigator.onLine){
      this.downloadsService.getAllScripts({name:"Joseph",email:"u18166793@tuks.co.za"}).subscribe({
        next:(value)=>{
          this.scripts = value;
        },
        error:(e)=>{
          console.log(e);
        }
      });
    }
    else{
      // Access from IndexDB 
    }
  }

  removeById(id:string): void{

    // if(){}
    /*
        Delete IndexedDB
    */
   this.downloadsService.removeById(id).subscribe({
    next:(value)=>{
      const temp:script[] = [];

      for(let count = 0; count < this.scripts.length; count++){
        if(this.scripts[count]._id !== value._id)
          temp.push(this.scripts[count]);
      }
      this.scripts = temp;
    },
    error:(e)=>{
      console.log(e);
    }
   });
  }

  setCurrentScript(id:string): void{
    if(navigator.onLine){
      this.downloadsService.getScriptById(id).subscribe({
        next:(value)=>{
          this.currentScript = value;
        },
        error:(e)=>{
          console.log(e);
        }
      });
    }
  }

  showInfo(value:script){
    this.router.navigate(['script-detail'], { state: { value: value } });
  }

  showEditor(value:script){
    this.router.navigate(['editor'],{ state: { value: value } });
  }

  play(value:script): void{
    this.router.navigate(['script-exec'], { state: { value: value } });
  }
}
