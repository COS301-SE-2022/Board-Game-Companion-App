import { Component, OnInit } from '@angular/core';
import { notification } from '../../models/notification';

@Component({
  selector: 'board-game-companion-app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss'],
})
export class NotificationComponent implements OnInit {

  notifications:notification[] = [];

  ngOnInit(): void {    
    console.log("notification");
  }

  add(value:notification): void{
    this.notifications.push(value);
  }

  pop(): void{
    this.notifications.pop();
  }
}


