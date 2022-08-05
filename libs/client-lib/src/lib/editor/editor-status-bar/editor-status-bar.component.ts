import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'board-game-companion-app-editor-status-bar',
  templateUrl: './editor-status-bar.component.html',
  styleUrls: ['./editor-status-bar.component.scss'],
})
export class EditorStatusBarComponent implements OnInit{
  @Input() height = 0;
  @Output() printStatusMessagesEvent = new EventEmitter();
  statusOfChanges = 2;

  ngOnInit(): void {
    this.statusOfChanges = 2;  
  }

  updateStatusOfChanges(val:number): void{
    this.statusOfChanges = val;
  }

  printStatusMessages(): void{
    this.printStatusMessagesEvent.emit();
  }

}
