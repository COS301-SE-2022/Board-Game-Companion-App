import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'board-game-companion-app-editor-help',
  templateUrl: './editor-help.component.html',
  styleUrls: ['./editor-help.component.scss'],
})
export class EditorHelpComponent implements OnInit{
  
  ngOnInit(): void {
      console.log("help");
  }
}
