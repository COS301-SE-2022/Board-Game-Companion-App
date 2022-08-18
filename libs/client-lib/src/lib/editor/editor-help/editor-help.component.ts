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
    Operation : false 
  }

  showType():void{
    this.isShown.dataType = true;
    this.isShown.declaration = false;
    this.isShown.arithmetic = false;
    this.isShown.Operation = false;
  }

  showDecl(): void{
    this.isShown.declaration = true;
    this.isShown.dataType = false;
    this.isShown.arithmetic = false;
    this.isShown.Operation = false;
  }

  showOp(): void{
    this.isShown.Operation = true;
    this.isShown.declaration = false;
    this.isShown.dataType = false;
    this.isShown.arithmetic = false;
    
  }


  //(click)="showDiv.previous = !showDiv.previous;showDiv.current = false;showDiv.next = false"
  // ngOnInit(): void {
  //     console.log("help");
  // }
}
