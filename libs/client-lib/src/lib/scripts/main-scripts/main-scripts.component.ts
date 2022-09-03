import { Component, OnInit, ViewChild } from '@angular/core';
import { myScript } from '../../shared/models/scripts/my-script';
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

  ngOnInit(): void {
    document.addEventListener('click', (value:MouseEvent) => {
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

      }break;
    }
  }

  newScript(value:myScript): void{
    if(this.myScripts !== undefined)
      this.myScripts.newScript(value);
  }

  search(): void{
    if(this.myScripts !== undefined)
      this.myScripts.search(this.searchTerm);
  }

  checkSearchOnEnter(value:any): void{
    if(value.key === "Enter"){
      value?.preventDefault();
      this.search();
    }
  }

}
