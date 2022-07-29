import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'board-game-companion-app-editor-status-bar',
  templateUrl: './editor-status-bar.component.html',
  styleUrls: ['./editor-status-bar.component.scss'],
})
export class EditorStatusBarComponent implements OnInit{
  @Input() height = 0;
  statusOfChanges = 2;

  ngOnInit(): void {
    console.log("editor-status-tool-bar");   
  }

  updateStatusOfChanges(val:number): void{
    this.statusOfChanges = val;
  }

}
