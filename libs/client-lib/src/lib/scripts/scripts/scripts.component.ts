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
  select:script = empty;
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
      },
      error:(e)=>{
        console.log(e)
      },
      complete:()=>{
        console.log("complete")
      }          
    });
  }

  selected(id:number): void{
    this.currentScript = id;
  }

  changeView(event:boolean): void{
    this.gridView = event;
  }
   
}
