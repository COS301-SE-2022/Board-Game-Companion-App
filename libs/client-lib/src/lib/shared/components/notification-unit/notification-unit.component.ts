import { Component, Input, OnInit,OnDestroy, Output, EventEmitter } from '@angular/core';



@Component({
  selector: 'board-game-companion-app-notification-unit',
  templateUrl: './notification-unit.component.html',
  styleUrls: ['./notification-unit.component.scss'],
})
export class NotificationUnitComponent implements OnInit,OnDestroy {
  @Input()type = "primary";
  @Input()message = "notification unit";
  @Output()removeEvent = new EventEmitter();

  opacity = 1;
  timer = 0;

  ngOnInit(): void { 
    this.timer = window.setInterval(()=>{
      this.opacity -= 0.2;
      
      if(this.opacity === 0.4)
        this.removeEvent.emit();

    },2000);
  }

  ngOnDestroy(): void {
      clearInterval(this.timer);
  }
}


