import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'board-game-companion-app-admin-scripts',
  templateUrl: './admin-scripts.component.html',
  styleUrls: ['./admin-scripts.component.scss'],
})
export class AdminScriptsComponent implements OnInit {
  
  ngOnInit(): void {
    console.log("admin")
  }

}
