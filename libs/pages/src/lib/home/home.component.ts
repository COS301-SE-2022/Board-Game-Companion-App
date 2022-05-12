import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'board-game-companion-app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  
})
export class HomeComponent implements OnInit {
  constructor() {}
  ids!: string[];
  ngOnInit(): void {
    
    this.ids = ['11111', '20202', '3030'];

  }
}
