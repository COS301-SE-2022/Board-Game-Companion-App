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
    uiInn: false, 
    uiOut: false, 
    // cIn: false, 
    // cOut: false, 
    endgame:false, 
    card:false,
    piece:false,
    tile:false, 
    player:false,
    state:false,
    DTree:false,
    nNetwork:false,
    minmax : false 
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
    this.isShown.uiInn = false;
    // this.isShown.cOut = false;
    // this.isShown.cIn = false;
    this.isShown.nNetwork=false;
    this.isShown.DTree =false;
    this.isShown.endgame = false; 
    this.isShown.card = false;
    this.isShown.piece = false; 
    this.isShown.tile = false; 
    this.isShown.player=false ;
    this.isShown.state = false;
    this.isShown.minmax = false;
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
    this.isShown.uiInn = false;
    // this.isShown.cOut = false;
    // this.isShown.cIn = false;
    this.isShown.nNetwork=false;
    this.isShown.DTree =false;
    this.isShown.endgame = false; 
    this.isShown.card = false;
    this.isShown.piece = false; 
    this.isShown.tile = false; 
    this.isShown.player=false ;
    this.isShown.state = false;
    this.isShown.minmax = false;
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
    this.isShown.uiInn = false;
    // this.isShown.cOut = false;
    // this.isShown.cIn = false;
    this.isShown.nNetwork=false;
    this.isShown.DTree =false;
    this.isShown.endgame = false; 
    this.isShown.card = false;
    this.isShown.piece = false; 
    this.isShown.tile = false; 
    this.isShown.player=false ;
    this.isShown.state = false;
    this.isShown.minmax = false;
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
    this.isShown.uiInn = false;
    // this.isShown.cOut = false;
    // this.isShown.cIn = false;
    this.isShown.nNetwork=false;
    this.isShown.DTree =false;
    this.isShown.endgame = false; 
    this.isShown.card = false;
    this.isShown.piece = false; 
    this.isShown.tile = false; 
    this.isShown.player=false ;
    this.isShown.state = false;
    this.isShown.minmax = false;
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
    this.isShown.uiInn = false;
    // this.isShown.cOut = false;
    // this.isShown.cIn = false;
    this.isShown.nNetwork=false;
    this.isShown.DTree =false;
    this.isShown.endgame = false; 
    this.isShown.card = false;
    this.isShown.piece = false; 
    this.isShown.tile = false; 
    this.isShown.player=false ;
    this.isShown.state = false;
    this.isShown.minmax = false;
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
    this.isShown.uiInn = false;
    // this.isShown.cOut = false;
    // this.isShown.cIn = false;
    this.isShown.nNetwork=false;
    this.isShown.DTree =false;
    this.isShown.endgame = false; 
    this.isShown.card = false;
    this.isShown.piece = false; 
    this.isShown.tile = false; 
    this.isShown.player=false ;
    this.isShown.state = false;
    this.isShown.minmax = false;
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
    this.isShown.uiInn = false;
    // this.isShown.cOut = false;
    // this.isShown.cIn = false;
    this.isShown.nNetwork=false;
    this.isShown.DTree =false;
    this.isShown.endgame = false; 
    this.isShown.card = false;
    this.isShown.piece = false; 
    this.isShown.tile = false; 
    this.isShown.player=false ;
    this.isShown.state = false;
    this.isShown.minmax = false;
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
    this.isShown.uiInn = false;
    // this.isShown.cOut = false;
    // this.isShown.cIn = false;
    this.isShown.nNetwork=false;
    this.isShown.DTree =false;
    this.isShown.endgame = false; 
    this.isShown.card = false;
    this.isShown.piece = false; 
    this.isShown.tile = false; 
    this.isShown.player=false ;
    this.isShown.state = false;
    this.isShown.minmax = false;
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
    this.isShown.uiInn = false;
    // this.isShown.cOut = false;
    // this.isShown.cIn = false;
    this.isShown.nNetwork=false;
    this.isShown.DTree =false;
    this.isShown.endgame = false; 
    this.isShown.card = false;
    this.isShown.piece = false; 
    this.isShown.tile = false; 
    this.isShown.player=false ;
    this.isShown.state = false;
    this.isShown.minmax = false;
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
    this.isShown.uiInn = false;
    // this.isShown.cOut = false;
    // this.isShown.cIn = false;
    this.isShown.nNetwork=false;
    this.isShown.DTree =false;
    this.isShown.endgame = false; 
    this.isShown.card = false;
    this.isShown.piece = false; 
    this.isShown.tile = false; 
    this.isShown.player=false ;
    this.isShown.state = false;
    this.isShown.minmax = false;
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
    this.isShown.uiInn = false;
    // this.isShown.cOut = false;
    // this.isShown.cIn = false;
    this.isShown.nNetwork=false;
    this.isShown.DTree =false;
    this.isShown.endgame = false; 
    this.isShown.card = false;
    this.isShown.piece = false; 
    this.isShown.tile = false; 
    this.isShown.player=false ;
    this.isShown.state = false;
    this.isShown.minmax = false;
  }

  uInput():void{
    this.isShown.uiInn = true;
    this.isShown.uiOut = false;
    this.isShown.continue= false;
    // this.isShown.cOut = false;
    // this.isShown.cIn = false;
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
    // this.isShown.cOut = false;
    // this.isShown.cIn = false;
    this.isShown.nNetwork=false;
    this.isShown.DTree =false;
    this.isShown.endgame = false; 
    this.isShown.card = false;
    this.isShown.piece = false; 
    this.isShown.tile = false; 
    this.isShown.player=false ;
    this.isShown.state = false;
    this.isShown.minmax = false;
  }

  uOutput():void{
    this.isShown.uiOut = true;
    this.isShown.uiInn = false;
    this.isShown.continue= false;
    // this.isShown.cOut = false;
    // this.isShown.cIn = false;
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
    this.isShown.nNetwork=false;
    this.isShown.DTree =false;
    this.isShown.endgame = false; 
    this.isShown.card = false;
    this.isShown.piece = false; 
    this.isShown.tile = false; 
    this.isShown.player=false ;
    this.isShown.state = false;
    this.isShown.minmax = false;
  }

  // cInput():void{
  //   this.isShown.cIn = true;
  //   this.isShown.uiOut = false;
  //   this.isShown.continue= false;
  //   this.isShown.cOut = false;
  //   this.isShown.uiInn = false;
  //   this.isShown.while= false;
  //   this.isShown.for = false;
  //   this.isShown.ifelse = false;
  //   this.isShown.ifState = false;
  //   this.isShown.relation = false;
  //   this.isShown.cond = false;
  //   this.isShown.logical =false; 
  //   this.isShown.arithmetic = false;
  //   this.isShown.declaration = false;
  //   this.isShown.dataType = false;
  //   this.isShown.nNetwork=false;
  //   this.isShown.DTree =false;
  //   this.isShown.endgame = false; 
  //   this.isShown.card = false;
  //   this.isShown.piece = false; 
  //   this.isShown.tile = false; 
  //   this.isShown.player=false ;
  //   this.isShown.state = false;
  //   this.isShown.minmax = false;
  // }

  // cOuput():void{
  //   this.isShown.cOut = true;
  //   this.isShown.uiOut = false;
  //   this.isShown.continue= false;
  //   this.isShown.uiInn = false;
  //   this.isShown.cIn = false;
  //   this.isShown.while= false;
  //   this.isShown.for = false;
  //   this.isShown.ifelse = false;
  //   this.isShown.ifState = false;
  //   this.isShown.relation = false;
  //   this.isShown.cond = false;
  //   this.isShown.logical =false; 
  //   this.isShown.arithmetic = false;
  //   this.isShown.declaration = false;
  //   this.isShown.dataType = false;
  //   this.isShown.nNetwork=false;
  //   this.isShown.DTree =false;
  //   this.isShown.endgame = false; 
  //   this.isShown.card = false;
  //   this.isShown.piece = false; 
  //   this.isShown.tile = false; 
  //   this.isShown.player=false ;
  //   this.isShown.state = false;
  //   this.isShown.minmax = false;
  // }

  // endgame:false,
  //   card:false,
  //   piece:false,
  //   tile:false, 
  //   player:false,
  //   state:false

  endgame():void{
    this.isShown.endgame = true; 
    this.isShown.card = false;
    this.isShown.piece = false; 
    this.isShown.tile = false; 
    this.isShown.player=false ;
    this.isShown.state = false;
    // this.isShown.cOut = false;
    this.isShown.uiOut = false;
    this.isShown.continue= false;
    this.isShown.uiInn = false;
    // this.isShown.cIn = false;
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
    this.isShown.nNetwork=false;
    this.isShown.DTree =false;
    this.isShown.minmax = false;
  }

  card():void{
    this.isShown.card = true; 
    this.isShown.endgame = false; 
    this.isShown.piece = false; 
    this.isShown.tile = false; 
    this.isShown.player=false ;
    this.isShown.state = false;
    // this.isShown.cOut = false;
    this.isShown.uiOut = false;
    this.isShown.continue= false;
    this.isShown.uiInn = false;
    // this.isShown.cIn = false;
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
    this.isShown.nNetwork=false;
    this.isShown.DTree =false;
    this.isShown.minmax = false;
  }

  piece():void{
    this.isShown.piece = true;
    this.isShown.endgame = false; 
    this.isShown.card = false; 
    this.isShown.tile = false; 
    this.isShown.player=false ;
    this.isShown.state = false;
    // this.isShown.cOut = false;
    this.isShown.uiOut = false;
    this.isShown.continue= false;
    this.isShown.uiInn = false;
    // this.isShown.cIn = false;
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
    this.isShown.nNetwork=false;
    this.isShown.DTree =false;
    this.isShown.minmax = false;
  }

  tile():void{
    this.isShown.tile = true; 
    this.isShown.endgame = false; 
    this.isShown.card = false;
    this.isShown.piece = false; 
    this.isShown.player=false ;
    this.isShown.state = false;
    // this.isShown.cOut = false;
    this.isShown.uiOut = false;
    this.isShown.continue= false;
    this.isShown.uiInn = false;
    // this.isShown.cIn = false;
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
    this.isShown.nNetwork=false;
    this.isShown.DTree =false;
    this.isShown.minmax = false;
  }

  player():void{
    this.isShown.player =true;
    this.isShown.endgame = false; 
    this.isShown.card = false;
    this.isShown.piece = false; 
    this.isShown.tile = false; 
    this.isShown.state = false;
    // this.isShown.cOut = false;
    this.isShown.uiOut = false;
    this.isShown.continue= false;
    this.isShown.uiInn = false;
    // this.isShown.cIn = false;
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
    this.isShown.nNetwork=false;
    this.isShown.DTree =false;
    this.isShown.minmax = false;
  }

  state():void{
    this.isShown.state =true;
    this.isShown.endgame = false; 
    this.isShown.card = false;
    this.isShown.piece = false; 
    this.isShown.tile = false; 
    this.isShown.player=false ;
    // this.isShown.cOut = false;
    this.isShown.uiOut = false;
    this.isShown.continue= false;
    this.isShown.uiInn = false;
    // this.isShown.cIn = false;
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
    this.isShown.nNetwork=false;
    this.isShown.DTree =false;
    this.isShown.minmax = false;
  }

  neuralNetwork():void{
    this.isShown.nNetwork=true;
    this.isShown.state =false;
    this.isShown.endgame = false; 
    this.isShown.card = false;
    this.isShown.piece = false; 
    this.isShown.tile = false; 
    this.isShown.player=false ;
    // this.isShown.cOut = false;
    this.isShown.uiOut = false;
    this.isShown.continue= false;
    this.isShown.uiInn = false;
    // this.isShown.cIn = false;
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
    this.isShown.DTree =false;
    this.isShown.minmax = false;
  }

  DecisionTree():void{
    this.isShown.DTree =true;
    this.isShown.nNetwork=false;
    this.isShown.state =false;
    this.isShown.endgame = false; 
    this.isShown.card = false;
    this.isShown.piece = false; 
    this.isShown.tile = false; 
    this.isShown.player=false ;
    // this.isShown.cOut = false;
    this.isShown.uiOut = false;
    this.isShown.continue= false;
    this.isShown.uiInn = false;
    // this.isShown.cIn = false;
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
    this.isShown.minmax = false;
  }

  minmaxAlgo():void{
    this.isShown.minmax = true; 
    this.isShown.DTree =false;
    this.isShown.nNetwork=false;
    this.isShown.state =false;
    this.isShown.endgame = false; 
    this.isShown.card = false;
    this.isShown.piece = false; 
    this.isShown.tile = false; 
    this.isShown.player=false ;
    // this.isShown.cOut = false;
    this.isShown.uiOut = false;
    this.isShown.continue= false;
    this.isShown.uiInn = false;
    // this.isShown.cIn = false;
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
