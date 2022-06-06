import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'board-game-companion-app-tool-bar',
  templateUrl: './tool-bar.component.html',
  styleUrls: ['./tool-bar.component.scss'],
  
})
export class ToolBarComponent implements OnInit {
  @Output()viewEvent = new EventEmitter<boolean>();

  ngOnInit(): void {
  
    console.log("toolbar");      
  }

  changeView(view:boolean): void{
    this.viewEvent.emit(view);
  }
   
}
