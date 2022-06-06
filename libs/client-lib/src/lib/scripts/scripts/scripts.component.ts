import { Component, OnInit } from '@angular/core';
import { empty, script } from '../../shared/models/script';
import { ScriptService } from '../../shared/services/scripts/script.service';
import { MenuItemModel } from '@syncfusion/ej2-navigations';

@Component({
  selector: 'board-game-companion-app-scripts',
  templateUrl: './scripts.component.html',
  styleUrls: ['./scripts.component.scss'],
  
})
export class ScriptsComponent implements OnInit {
  scripts:script[] = [];
  currentScript = -1;
  gridView = true;

  constructor(private readonly scriptService:ScriptService){}

  ngOnInit(): void {
    this.loadAllScripts();
  }

  loadAllScripts(): void{
    this.scriptService.retrieveAllScript().subscribe({
      next:(value)=>{
        this.scripts = value;
        for(let count = 0; count < this.scripts.length; count++){
          console.log(this.scriptService.getApiUrl() + this.replaceBackSlash(this.scripts[count].icon));
        }
      },
      error:(e)=>{
        console.log(e)
      },
      complete:()=>{
        console.log("complete")
      }          
    });
  }

  replaceBackSlash(input:string):string{
    let result = "";

    for(let count = 0; count < input.length; count++){
      if(input[count] === "\\")
        result += "/";
      else
        result += input[count];
    }
    return result;
  }

  selected(id:number): void{
    this.currentScript = id;

  }

  changeView(event:boolean): void{
    this.gridView = event;
  }

  containerClick(event:any): void{
    if(event.target.id == "wrapper")
      this.currentScript = -1;
  }
   
}
