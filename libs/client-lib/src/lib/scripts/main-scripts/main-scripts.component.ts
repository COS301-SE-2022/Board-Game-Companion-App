import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'board-game-companion-app-main-scripts',
  templateUrl: './main-scripts.component.html',
  styleUrls: ['./main-scripts.component.scss'],
}) 
export class MainScriptsComponent implements OnInit {
  page = 0;
  gridView = true;
  showControlMenu = false;

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
  }

}
