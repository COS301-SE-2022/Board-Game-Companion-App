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
    ifelse:false,
    for:false, 
    while:false, 
    continue:false, 
    uiIn: false, 
    uiOut: false, 
    cIn: false, 
    cOut: false
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
    this.isShown.for=false;
    this.isShown.while=false;
    this.isShown.continue=false;
    this.isShown.uiOut = false;
    this.isShown.uiIn = false;
    this.isShown.cOut = false;
    this.isShown.cIn = false;
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
    this.isShown.for=false;
    this.isShown.while=false;
    this.isShown.continue=false;
    this.isShown.uiOut = false;
    this.isShown.uiIn = false;
    this.isShown.cOut = false;
    this.isShown.cIn = false;
  }

  showArithmetic(): void{
    this.isShown.arithmetic = true;
    this.isShown.declaration = false;
    this.isShown.dataType = false;
    this.isShown.logical =false; 
    this.isShown.cond = false;
    this.isShown.ifState = false;
    this.isShown.ifelse = false;
    this.isShown.for=false;
    this.isShown.while=false;
    this.isShown.continue=false;
    this.isShown.uiOut = false;
    this.isShown.uiIn = false;
    this.isShown.cOut = false;
    this.isShown.cIn = false;
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
    this.isShown.for=false;
    this.isShown.while=false;
    this.isShown.continue=false;
    this.isShown.uiOut = false;
    this.isShown.uiIn = false;
    this.isShown.cOut = false;
    this.isShown.cIn = false;
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
    this.isShown.for=false;
    this.isShown.while=false;
    this.isShown.continue=false;
    this.isShown.uiOut = false;
    this.isShown.uiIn = false;
    this.isShown.cOut = false;
    this.isShown.cIn = false;
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
    this.isShown.for=false;
    this.isShown.while=false;
    this.isShown.continue=false;
    this.isShown.uiOut = false;
    this.isShown.uiIn = false;
    this.isShown.cOut = false;
    this.isShown.cIn = false;
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
    this.isShown.for=false;
    this.isShown.while=false;
    this.isShown.continue=false;
    this.isShown.uiOut = false;
    this.isShown.uiIn = false;
    this.isShown.cOut = false;
    this.isShown.cIn = false;
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
    this.isShown.for=false;
    this.isShown.while=false;
    this.isShown.continue=false;
    this.isShown.uiOut = false;
    this.isShown.uiIn = false;
    this.isShown.cOut = false;
    this.isShown.cIn = false;
  }

  showFor():void{
    this.isShown.for = true;
    this.isShown.while= false;
    this.isShown.continue= false;
    this.isShown.ifelse = false;
    this.isShown.ifState = false;
    this.isShown.relation = false;
    this.isShown.cond = false;
    this.isShown.logical =false; 
    this.isShown.arithmetic = false;
    this.isShown.declaration = false;
    this.isShown.dataType = false;
    this.isShown.uiOut = false;
    this.isShown.uiIn = false;
    this.isShown.cOut = false;
    this.isShown.cIn = false;
  }

  showWhile():void{
    this.isShown.while= true;
    this.isShown.for = false;
    this.isShown.continue= false;
    this.isShown.ifelse = false;
    this.isShown.ifState = false;
    this.isShown.relation = false;
    this.isShown.cond = false;
    this.isShown.logical =false; 
    this.isShown.arithmetic = false;
    this.isShown.declaration = false;
    this.isShown.dataType = false;
    this.isShown.uiOut = false;
    this.isShown.uiIn = false;
    this.isShown.cOut = false;
    this.isShown.cIn = false;
  }

  showContinue():void{
    this.isShown.continue= true;
    this.isShown.while= false;
    this.isShown.for = false;
    this.isShown.ifelse = false;
    this.isShown.ifState = false;
    this.isShown.relation = false;
    this.isShown.cond = false;
    this.isShown.logical =false; 
    this.isShown.arithmetic = false;
    this.isShown.declaration = false;
    this.isShown.dataType = false;
    this.isShown.uiOut = false;
    this.isShown.uiIn = false;
    this.isShown.cOut = false;
    this.isShown.cIn = false;
  }
  

  uInput():void{
    this.isShown.uiIn = true;
    this.isShown.uiOut = false;
    this.isShown.continue= false;
    this.isShown.cOut = false;
    this.isShown.cIn = false;
    this.isShown.while= false;
    this.isShown.for = false;
    this.isShown.ifelse = false;
    this.isShown.ifState = false;
    this.isShown.relation = false;
    this.isShown.cond = false;
    this.isShown.logical =false; 
    this.isShown.arithmetic = false;
    this.isShown.declaration = false;
    this.isShown.dataType = false;
    this.isShown.uiOut = false;
    this.isShown.uiIn = false;
    this.isShown.cOut = false;
    this.isShown.cIn = false;
  }

  uOutput():void{
    this.isShown.uiOut = true;
    this.isShown.uiIn = false;
    this.isShown.continue= false;
    this.isShown.cOut = false;
    this.isShown.cIn = false;
    this.isShown.while= false;
    this.isShown.for = false;
    this.isShown.ifelse = false;
    this.isShown.ifState = false;
    this.isShown.relation = false;
    this.isShown.cond = false;
    this.isShown.logical =false; 
    this.isShown.arithmetic = false;
    this.isShown.declaration = false;
    this.isShown.dataType = false;
  }

  cInput():void{
    this.isShown.cIn = true;
    this.isShown.uiOut = false;
    this.isShown.continue= false;
    this.isShown.cOut = false;
    this.isShown.uiIn = false;
    this.isShown.while= false;
    this.isShown.for = false;
    this.isShown.ifelse = false;
    this.isShown.ifState = false;
    this.isShown.relation = false;
    this.isShown.cond = false;
    this.isShown.logical =false; 
    this.isShown.arithmetic = false;
    this.isShown.declaration = false;
    this.isShown.dataType = false;
  }

  cOuput():void{
    this.isShown.cOut = true;
    this.isShown.uiOut = false;
    this.isShown.continue= false;
    this.isShown.uiIn = false;
    this.isShown.cIn = false;
    this.isShown.while= false;
    this.isShown.for = false;
    this.isShown.ifelse = false;
    this.isShown.ifState = false;
    this.isShown.relation = false;
    this.isShown.cond = false;
    this.isShown.logical =false; 
    this.isShown.arithmetic = false;
    this.isShown.declaration = false;
    this.isShown.dataType = false;
  }
}
