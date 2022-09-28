import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'board-game-companion-app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
})
export class AdminComponent implements OnInit {
  tab = 0;

  ngOnInit(): void {
    this.tab = 0;
  }

}
