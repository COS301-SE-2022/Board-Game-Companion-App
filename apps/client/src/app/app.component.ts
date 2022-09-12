import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'board-game-companion-app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'client';
  headerHeight = 8;
  contentHeight = 84;
  footerHeight = 8;
  constructor(private router:Router){

  }

  ngOnInit():void{
    console.log('app');
  }
}
