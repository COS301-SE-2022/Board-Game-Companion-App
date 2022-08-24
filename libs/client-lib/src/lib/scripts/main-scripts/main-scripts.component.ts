import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'board-game-companion-app-main-scripts',
  templateUrl: './main-scripts.component.html',
  styleUrls: ['./main-scripts.component.scss'],
})
export class MainScriptsComponent implements OnInit {
  page = "Scripts"; // Default page;

  constructor() {}

  ngOnInit(): void {}

  Tab(page:string) : void
  {
    this.page = page;
  }

}
