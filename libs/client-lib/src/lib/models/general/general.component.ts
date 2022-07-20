import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'board-game-companion-app-general',
  templateUrl: './general.component.html',
  styleUrls: ['./general.component.scss'],
  
})
export class GeneralComponent implements OnInit {
  tab = 0;

  ngOnInit(): void{
    console.log("models")
  }

  changeTab(value:number): void{
    this.tab = value;
  }
}
