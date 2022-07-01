import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'board-game-companion-app-editor-tool-bar',
  templateUrl: './editor-tool-bar.component.html',
  styleUrls: ['./editor-tool-bar.component.scss'],
})
export class EditorToolBarComponent implements OnInit{
  @Input() height = 0;
  @Output() executeEvent = new EventEmitter();
  
  ngOnInit(): void {
    console.log("editor-tool-bar");   
  }

  execute(): void {
    this.executeEvent.emit();
  }

}
