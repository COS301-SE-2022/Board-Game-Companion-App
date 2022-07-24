import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'board-game-companion-app-models',
  templateUrl: './models.component.html',
  styleUrls: ['./models.component.scss'],
  
})
export class ModelsComponent implements OnInit {
  tab = 0;

  ngOnInit(): void{
    console.log("models")
  }

  changeTab(value:number): void{
    this.tab = value;
  }


}
