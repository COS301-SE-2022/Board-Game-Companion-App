import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { entity } from '../../shared/models/entity';
import { script } from '../../shared/models/script';
//import * as ace from 'apps/client/src/assets/js/ace-editor/src-min/ace'

@Component({
  selector: 'board-game-companion-app-editor-side-bar',
  templateUrl: './editor-side-bar.component.html',
  styleUrls: ['./editor-side-bar.component.scss'],
})
export class EditorSideBarComponent implements OnInit{
  @Input() height = 0;
  @Input() width = 0;
  @Input() current!:script;
  @Output() resizeEvent = new EventEmitter<number>();
  
  ngOnInit(): void {
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
