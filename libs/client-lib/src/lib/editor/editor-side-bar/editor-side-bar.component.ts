import { Component, OnInit, Input, Output, EventEmitter, ViewChildren, QueryList } from '@angular/core';
import { Ace } from 'ace-builds';
import { entity } from '../../shared/models/entity';
import { script, empty } from '../../shared/models/script';
import { selection } from '../../shared/models/selection';
import { EditorEntityComponent } from '../editor-entity/editor-entity.component';
import { EditorVisualsComponent } from '../editor-visuals/editor-visuals.component';
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
  @Input() current:script = empty;
  @Output() resizeEvent = new EventEmitter<number>();
  @Output() selectionEvent = new EventEmitter<selection>();
  @Output() removeEvent = new EventEmitter<selection>();
  @ViewChildren(EditorEntityComponent) entities: QueryList<EditorEntityComponent> = new QueryList<EditorEntityComponent>();
  
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
    this.entities.forEach((component:EditorEntityComponent)=>{
      component.cursorChange(value);
    })
  }
}
