import { Component, OnInit, Input, Output, EventEmitter, ViewChildren, QueryList, ViewChild } from '@angular/core';
import { Ace } from 'ace-builds';
import { entity } from '../../shared/models/editor/entity';
import { script, empty } from '../../shared/models/scripts/script';
import { selection } from '../../shared/models/editor/selection';
import { EditorEntityComponent } from '../editor-entity/editor-entity.component';
import { EditorVisualsComponent } from '../editor-visual-side-bar/editor-visual-side-bar.component';
import { myScript } from '../../shared/models/scripts/my-script';
import { EditorTextSideBarComponent } from '../editor-text-side-bar/editor-text-side-bar.component';
//import * as ace from 'apps/client/src/assets/js/ace-editor/src-min/ace'

@Component({
  selector: 'board-game-companion-app-editor-side-bar',
  templateUrl: './editor-side-bar.component.html',
  styleUrls: ['./editor-side-bar.component.scss'],
})
export class EditorSideBarComponent implements OnInit{
  @Input() VDSL = false;
  @Input() height = 0;
  @Input() width = 0;
  @Input() current!:myScript;
  @Output() resizeEvent = new EventEmitter<number>();
  @Output() selectionEvent = new EventEmitter<selection>();
  @Output() removeEvent = new EventEmitter<selection>();
  @ViewChildren(EditorEntityComponent) entities: QueryList<EditorEntityComponent> = new QueryList<EditorEntityComponent>();
  @ViewChild(EditorTextSideBarComponent,{static:false}) editorTextSideBar!: EditorTextSideBarComponent;

  ngOnInit(): void {
    setInterval(()=>{
      const temp = document.getElementById("editor-side-bar")?.style.width;
      const value = parseInt(temp == undefined ? "" : temp);
      
      if(value !== this.width){ 
        this.resizeEvent.emit(value);
      }
    },5);
  }

  changeDisplay(value: boolean)
  {
    if(value)
    {
      this.VDSL = true
    }
    else
    {
      this.VDSL= false
    }
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

  highlight(value:selection){
    this.selectionEvent.emit(value);
  }

  remove(value:selection){
    this.removeEvent.emit(value);
  }

  cursorChange(value:Ace.Point): void{
    this.editorTextSideBar.cursorChange(value);
  }
}
