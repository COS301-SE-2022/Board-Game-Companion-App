import { Component, OnInit } from '@angular/core';
import { ScriptService } from '../../shared/services/scripts/script.service';
import { script, empty } from '../../shared/models/script';
import { Router } from '@angular/router';

@Component({
  selector: 'board-game-companion-app-own-scripts-page',
  templateUrl: './own-scripts-page.component.html',
  styleUrls: ['./own-scripts-page.component.scss'],
})
export class OwnScriptsPageComponent implements OnInit {
  myScripts:script[] = [];
  myCurrentScript:script = empty;

  constructor(private readonly scriptService:ScriptService, private readonly router:Router) {}

  ngOnInit(): void {
    this.allMyScripts();
  }

  allMyScripts():void{
    this.scriptService.getScriptsCreatedByMe({name:"Joseph",email:"u18166793@tuks.co.za"}).subscribe({
      next:(value)=>{
        this.myScripts = value;
      },
      error:(e)=>{
        console.log(e);
      }
    });
  }
  removeScript(id:string):void{
    this.scriptService.removeScript(id).subscribe({
      next:(value)=>{
        const temp:script[] = [];

        for(let count = 0; count < this.myScripts.length; count++){
          if(this.myScripts[count]._id !== id)
            temp.push(this.myScripts[count]);
        }
        this.myScripts = temp;
      },
      error:(e)=>{
        console.log(e);
      }
    });
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
