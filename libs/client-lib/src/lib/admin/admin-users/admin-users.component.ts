import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'board-game-companion-app-admin-others',
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.scss'],
})
export class AdminUsersComponent implements OnInit {
  
  ngOnInit(): void {
    console.log("admin")
  }

}
