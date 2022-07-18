import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
//import * as ace from 'apps/client/src/assets/js/ace-editor/src-min/ace'

@Component({
  selector: 'board-game-companion-app-editor-side-bar',
  templateUrl: './editor-side-bar.component.html',
  styleUrls: ['./editor-side-bar.component.scss'],
})
export class EditorSideBarComponent implements OnInit{
  @Input() height = 0;
  @Input() width = 0;
  @Output() resizeEvent = new EventEmitter<number>();
  
  ngOnInit(): void {
    console.log("editor");
    setInterval(()=>{
      const temp = document.getElementById("editor-side-bar")?.style.width;
      const value = parseInt(temp == undefined ? "" : temp);
      
      if(value !== this.width){ 
        this.resizeEvent.emit(value);
      }
    },5);
  }

  getMaxWidth(): number{
    return 250;
  }

  open(): void{
    this.width = 180;
    this.resizeEvent.emit(180);
  }

  close(): void{
    this.width = 0;
    this.resizeEvent.emit(0);
  }
}
