import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'board-game-companion-app-editor-help',
  templateUrl: './editor-help.component.html',
  styleUrls: ['./editor-help.component.scss'],
})
export class EditorHelpComponent {
  isShown = {
    dataType : false,
    declaration : false,
    arithmetic : false,
    logical :false,
    cond:false,
    relation:false,
    ifState:false,
    ifelse:false
  }

  showType():void{
    this.isShown.dataType = true;
    this.isShown.declaration = false;
    this.isShown.arithmetic = false;
    this.isShown.logical =false; 
    this.isShown.cond = false;
    this.isShown.relation = false;
    this.isShown.ifState = false;
    this.isShown.ifelse = false;
  }

  showDecl(): void{
    this.isShown.declaration = true;
    this.isShown.dataType = false;
    this.isShown.arithmetic = false;
    this.isShown.logical =false; 
    this.isShown.cond = false;
    this.isShown.relation = false;
    this.isShown.ifState = false;
    this.isShown.ifelse = false;
  }

  showArithmetic(): void{
    this.isShown.arithmetic = true;
    this.isShown.declaration = false;
    this.isShown.dataType = false;
    this.isShown.logical =false; 
    this.isShown.cond = false;
    this.isShown.ifState = false;
    this.isShown.ifelse = false;
  }

  showLogical():void{
    this.isShown.logical =true; 
    this.isShown.arithmetic = false;
    this.isShown.declaration = false;
    this.isShown.dataType = false;
    this.isShown.cond = false;
    this.isShown.relation = false;
    this.isShown.ifState = false;
    this.isShown.ifelse = false;
  }

  showCond():void {
    this.isShown.cond = true;
    this.isShown.logical =false; 
    this.isShown.arithmetic = false;
    this.isShown.declaration = false;
    this.isShown.dataType = false;
    this.isShown.relation = false;
    this.isShown.ifState = false;
    this.isShown.ifelse = false;
  }

  showRelation():void {
    this.isShown.relation = true;
    this.isShown.cond = false;
    this.isShown.logical =false; 
    this.isShown.arithmetic = false;
    this.isShown.declaration = false;
    this.isShown.dataType = false;
    this.isShown.ifState = false;
    this.isShown.ifelse = false;
  }

  showif():void{
    this.isShown.ifState = true;
    this.isShown.relation = false;
    this.isShown.cond = false;
    this.isShown.logical =false; 
    this.isShown.arithmetic = false;
    this.isShown.declaration = false;
    this.isShown.dataType = false;
    this.isShown.ifelse = false;
  }

  showifelse():void{
    this.isShown.ifelse = true;
    this.isShown.ifState = false;
    this.isShown.relation = false;
    this.isShown.cond = false;
    this.isShown.logical =false; 
    this.isShown.arithmetic = false;
    this.isShown.declaration = false;
    this.isShown.dataType = false;
  }


  //(click)="showDiv.previous = !showDiv.previous;showDiv.current = false;showDiv.next = false"
  // ngOnInit(): void {
  //     console.log("help");
  // }
}
