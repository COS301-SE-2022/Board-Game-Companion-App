import { Component, OnInit, Input, Output, EventEmitter, ViewChildren, QueryList } from '@angular/core';
import { Ace } from 'ace-builds';
import { entity } from '../../shared/models/editor/entity';
import { selection } from '../../shared/models/editor/selection';

@Component({
  selector: 'board-game-companion-app-editor-entity',
  templateUrl: './editor-entity.component.html',
  styleUrls: ['./editor-entity.component.scss'],
})
export class EditorEntityComponent implements OnInit{
  @Input()current!:entity;
  @Input()depth = 0;
  showChildren = false
  @Output()selectionEvent = new EventEmitter<selection>();
  @Output()removeEvent = new EventEmitter<selection>();
  @Output()removeParentSelectEvent = new EventEmitter();
  @ViewChildren(EditorEntityComponent) entities: QueryList<EditorEntityComponent> = new QueryList<EditorEntityComponent>();
  select = false;
  cursor:Ace.Point = {row:1,column:1};

  ngOnInit(): void {
    this.select = false;
  }

  highlight(){
    this.selectionEvent.emit({
      startLine: this.current.startLine,
      endLine: this.current.endLine,
      endPosition: this.current.endPosition,
      startPosition: this.current.startPosition
    });
  }

  propagateHighlightEvent(value:selection){
    this.selectionEvent.emit(value);
  }

  remove(): void{
    this.removeEvent.emit({
      startLine: this.current.startLine,
      endLine: this.current.endLine,
      endPosition: this.current.endPosition,
      startPosition: this.current.startPosition
    }); 
  }

  propagateRemoveEvent(value:selection){
    this.removeEvent.emit(value);
  }

  deselect(): void{
    if(this.select){
      this.select = false;
      this.removeParentSelectEvent.emit();
    }
  }

  caret(): void{
    this.showChildren = !this.showChildren;
  }

  cursorChange(value:Ace.Point): void{

    this.cursor = value;
    

    if(value.row > this.current.startLine && value.row < this.current.endLine){
      
        this.select = true;
        this.removeParentSelectEvent.emit();

        if(this.showChildren){
          this.entities.forEach((component:EditorEntityComponent)=>{
            component.cursorChange(value);
          })
        }
    
    }else if(value.row === this.current.startLine && value.row === this.current.endLine){
      if(value.column >= this.current.startPosition && value.column <= this.current.endPosition){
        
        this.select = true;
        this.removeParentSelectEvent.emit();

        if(this.showChildren){
          this.entities.forEach((component:EditorEntityComponent)=>{
            component.cursorChange(value);
          })
        }

      }else{
        this.select = false;
        this.entities.forEach((component:EditorEntityComponent)=>{
          component.select = false;
        })
      }
    }else if(value.row === this.current.startLine){
      if(value.column >= this.current.startPosition){
        
        this.select = true;
        this.removeParentSelectEvent.emit();
        
        if(this.showChildren){
          this.entities.forEach((component:EditorEntityComponent)=>{
            component.cursorChange(value);
          })
        }

      }else{
        this.select = false;
        this.entities.forEach((component:EditorEntityComponent)=>{
          component.select = false;
        })
      }
    }else if(value.row === this.current.endLine){
      if(value.column <= this.current.endPosition){
        
        this.select = true;
        this.removeParentSelectEvent.emit();
        
        if(this.showChildren){
          this.entities.forEach((component:EditorEntityComponent)=>{
            component.cursorChange(value);
          })
        }

      }else{
        this.select = false;
        this.entities.forEach((component:EditorEntityComponent)=>{
          component.select = false;
        })
      }
    }else{
      this.select = false;
      this.entities.forEach((component:EditorEntityComponent)=>{
        component.select = false;
      })
    }
  }

}
