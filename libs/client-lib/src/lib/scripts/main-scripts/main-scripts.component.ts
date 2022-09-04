import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { myScript } from '../../shared/models/scripts/my-script';
import { AutomataScriptComponent } from '../automata-scripts/automata-scripts.component';
import { MyScriptsComponent } from '../my-scripts/my-scripts.component';

@Component({
  selector: 'board-game-companion-app-main-scripts',
  templateUrl: './main-scripts.component.html',
  styleUrls: ['./main-scripts.component.scss'],
}) 
export class MainScriptsComponent implements OnInit {
  page = 0;
  gridView = true;
  showControlMenu = false;
  searchTerm = "";
  @ViewChild(MyScriptsComponent,{static:false}) myScripts!: MyScriptsComponent;
  @ViewChild(AutomataScriptComponent,{static:false}) automataScripts!: AutomataScriptComponent;

  constructor(private elementRef:ElementRef){}
  
  ngOnInit(): void {
    this.elementRef.nativeElement.addEventListener('click', (value:MouseEvent) => {
      const box = document.getElementById('script-control-menu') as HTMLElement;
      const menu = document.getElementById('control-menu-btn') as HTMLElement;

      if(!box.contains(value.target as Node) && !menu.contains(value.target as Node)) {
        this.showControlMenu = false;
      }
    });
  }

  toggleControlMenu(){
    this.showControlMenu = !this.showControlMenu;
  }

  tab(value:number) : void{
    this.page = value;
    this.gridView = true;
    
    switch(value){
      case 0:{

      }break;
      case 1:{
        if(this.myScripts !== undefined)
          this.myScripts.ngOnInit();
      }break;
      case 2:{
        if(this.automataScripts !== undefined)
          this.automataScripts.ngOnInit();
      }break;
    }
  }

  newScript(value:myScript): void{
    if(this.myScripts !== undefined)
      this.myScripts.newScript(value);
  }

  search(): void{
    switch(this.page){
      case 0:{

      }break;
      case 1:{
        if(this.myScripts !== undefined)
          this.myScripts.search(this.searchTerm);
      }break;
      case 2:{
        if(this.automataScripts !== undefined)
          this.automataScripts.search(this.searchTerm);
      }break;
    }
  }

  checkSearchOnEnter(value:any): void{
    if(value.key === "Enter"){
      value?.preventDefault();
      this.search();
    }
  }

}
