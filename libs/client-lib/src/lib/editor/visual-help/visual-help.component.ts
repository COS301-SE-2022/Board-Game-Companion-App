import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'board-game-companion-app-visual-help',
  templateUrl: './visual-help.component.html',
  styleUrls: ['./visual-help.component.scss'],
})
export class VisualHelpComponent {
  isShown = {
    create : false,
    setting : false,
    visualIf:false,
    visualfor:false, 
    visualwhile:false, 
    uiInn: false, 
    uiOut: false, 
    turn:false, 
    actions:false,
    math:false, 
    predefined:false,
    return:false,
    tile:false, 
    player:false,
    board:false,
    endgame:false,
    nNetwork:false,
    cond : false 
  }

  creation():void{
    this.isShown.create = true;
    this.isShown.setting = false;
    this.isShown.visualIf = false;
    this.isShown.visualfor=false;
    this.isShown.visualwhile=false;
    this.isShown.uiOut = false;
    this.isShown.uiInn = false;
    this.isShown.nNetwork=false;
    this.isShown.endgame =false;
    this.isShown.math = false; 
    this.isShown.predefined = false;
    this.isShown.return = false; 
    this.isShown.tile = false; 
    this.isShown.player=false ;
    this.isShown.board = false;
    this.isShown.cond = false;
    this.isShown.turn = false;
    this.isShown.actions = false;
  }

  setting(): void{
    this.isShown.setting = true;
    this.isShown.create = false;
    this.isShown.visualIf = false; 
    this.isShown.visualfor=false;
    this.isShown.visualwhile=false;
    this.isShown.uiOut = false;
    this.isShown.uiInn = false;
    this.isShown.nNetwork=false;
    this.isShown.endgame =false;
    this.isShown.math = false; 
    this.isShown.predefined = false;
    this.isShown.return = false; 
    this.isShown.tile = false; 
    this.isShown.player=false ;
    this.isShown.board = false;
    this.isShown.cond = false;
    this.isShown.turn = false;
    this.isShown.actions = false;
  }

  showif():void{
    this.isShown.visualIf = true; 
    this.isShown.setting = false;
    this.isShown.create = false;
    this.isShown.visualfor=false;
    this.isShown.visualwhile=false;
    this.isShown.uiOut = false;
    this.isShown.uiInn = false;
    this.isShown.nNetwork=false;
    this.isShown.endgame =false;
    this.isShown.math = false; 
    this.isShown.predefined = false;
    this.isShown.return = false; 
    this.isShown.tile = false; 
    this.isShown.player=false ;
    this.isShown.board = false;
    this.isShown.cond = false;
    this.isShown.turn = false;
    this.isShown.actions = false;
  }

  showFor():void{
    this.isShown.visualfor = true;
    this.isShown.visualwhile= false;
    this.isShown.visualIf = false; 
    this.isShown.setting = false;
    this.isShown.create = false;
    this.isShown.uiOut = false;
    this.isShown.uiInn = false;
    this.isShown.nNetwork=false;
    this.isShown.endgame =false;
    this.isShown.math = false; 
    this.isShown.predefined = false;
    this.isShown.return = false; 
    this.isShown.tile = false; 
    this.isShown.player=false ;
    this.isShown.board = false;
    this.isShown.cond = false;
    this.isShown.turn = false;
    this.isShown.actions = false;
  }

  showWhile():void{
    this.isShown.visualwhile= true;
    this.isShown.visualfor = false;
    this.isShown.visualIf = false;
    this.isShown.setting = false;
    this.isShown.create = false;
    this.isShown.uiOut = false;
    this.isShown.uiInn = false;
    this.isShown.nNetwork=false;
    this.isShown.endgame =false;
    this.isShown.math = false; 
    this.isShown.predefined = false;
    this.isShown.return = false; 
    this.isShown.tile = false; 
    this.isShown.player=false ;
    this.isShown.board = false;
    this.isShown.cond = false;
    this.isShown.turn = false;
    this.isShown.actions = false;
  }

  uInput():void{
    this.isShown.uiInn = true;
    this.isShown.uiOut = false;
    this.isShown.visualwhile= false;
    this.isShown.visualfor = false;
    this.isShown.visualIf = false;
    this.isShown.setting = false;
    this.isShown.create = false;
    this.isShown.uiOut = false;
    this.isShown.nNetwork=false;
    this.isShown.endgame =false;
    this.isShown.math = false; 
    this.isShown.predefined = false;
    this.isShown.return = false; 
    this.isShown.tile = false; 
    this.isShown.player=false ;
    this.isShown.board = false;
    this.isShown.cond = false;
    this.isShown.turn = false;
    this.isShown.actions = false;
  }

  uOutput():void{
    this.isShown.uiOut = true;
    this.isShown.uiInn = false;
    this.isShown.visualwhile= false;
    this.isShown.visualfor = false;
    this.isShown.visualIf = false;
    this.isShown.setting = false;
    this.isShown.create = false;
    this.isShown.nNetwork=false;
    this.isShown.endgame =false;
    this.isShown.math = false; 
    this.isShown.predefined = false;
    this.isShown.return = false; 
    this.isShown.tile = false; 
    this.isShown.player=false ;
    this.isShown.board = false;
    this.isShown.cond = false;
    this.isShown.turn = false;
    this.isShown.actions = false;
  }

  func():void{
    this.isShown.math = true; 
    this.isShown.predefined = false;
    this.isShown.return = false; 
    this.isShown.tile = false; 
    this.isShown.player=false ;
    this.isShown.board = false;
    this.isShown.uiOut = false;
    this.isShown.uiInn = false;
    this.isShown.visualwhile= false;
    this.isShown.visualfor = false;
    this.isShown.visualIf = false;
    this.isShown.setting = false;
    this.isShown.create = false;
    this.isShown.nNetwork=false;
    this.isShown.endgame =false;
    this.isShown.cond = false;
    this.isShown.turn = false;
    this.isShown.actions = false;
  }

  preDefined():void{
    this.isShown.predefined = true; 
    this.isShown.math = false; 
    this.isShown.return = false; 
    this.isShown.tile = false; 
    this.isShown.player=false ;
    this.isShown.board = false;
    this.isShown.uiOut = false;
    this.isShown.uiInn = false;
    this.isShown.visualwhile= false;
    this.isShown.visualfor = false;
    this.isShown.visualIf = false;
    this.isShown.setting = false;
    this.isShown.create = false;
    this.isShown.nNetwork=false;
    this.isShown.endgame =false;
    this.isShown.cond = false;
    this.isShown.turn = false;
    this.isShown.actions = false;
  }

  return():void{
    this.isShown.return = true;
    this.isShown.math = false; 
    this.isShown.predefined = false; 
    this.isShown.tile = false; 
    this.isShown.player=false ;
    this.isShown.board = false;
    this.isShown.uiOut = false;
    this.isShown.uiInn = false;
    this.isShown.visualwhile= false;
    this.isShown.visualfor = false;
    this.isShown.visualIf = false;
    this.isShown.setting = false;
    this.isShown.create = false;
    this.isShown.nNetwork=false;
    this.isShown.endgame =false;
    this.isShown.cond = false;
    this.isShown.turn = false;
    this.isShown.actions = false;
  }

  tile():void{
    this.isShown.tile = true; 
    this.isShown.math = false; 
    this.isShown.predefined = false;
    this.isShown.return = false; 
    this.isShown.player=false ;
    this.isShown.board = false;
    this.isShown.uiOut = false;
    this.isShown.uiInn = false;
    this.isShown.visualwhile= false;
    this.isShown.visualfor = false;
    this.isShown.visualIf = false; 
    this.isShown.setting = false;
    this.isShown.create = false;
    this.isShown.nNetwork=false;
    this.isShown.endgame =false;
    this.isShown.cond = false;
    this.isShown.turn = false;
    this.isShown.actions = false;
  }

  player():void{
    this.isShown.player =true;
    this.isShown.math = false; 
    this.isShown.predefined = false;
    this.isShown.return = false; 
    this.isShown.tile = false; 
    this.isShown.board = false;
    this.isShown.uiOut = false;
    this.isShown.uiInn = false;
    this.isShown.visualwhile= false;
    this.isShown.visualfor = false;
    this.isShown.visualIf = false;
    this.isShown.setting = false;
    this.isShown.create = false;
    this.isShown.nNetwork=false;
    this.isShown.endgame =false;
    this.isShown.cond = false;
    this.isShown.turn = false;
    this.isShown.actions = false;
  }

  board():void{
    this.isShown.board =true;
    this.isShown.math = false; 
    this.isShown.predefined = false;
    this.isShown.return = false; 
    this.isShown.tile = false; 
    this.isShown.player=false ;
    this.isShown.uiOut = false;
    this.isShown.uiInn = false;
    this.isShown.visualwhile= false;
    this.isShown.visualfor = false;
    this.isShown.visualIf = false;
    this.isShown.setting = false;
    this.isShown.create = false;
    this.isShown.nNetwork=false;
    this.isShown.endgame =false;
    this.isShown.cond = false;
    this.isShown.turn = false;
    this.isShown.actions = false;
  }

  neuralNetwork():void{
    this.isShown.nNetwork=true;
    this.isShown.board =false;
    this.isShown.math = false; 
    this.isShown.predefined = false;
    this.isShown.return = false; 
    this.isShown.tile = false; 
    this.isShown.player=false ;
    this.isShown.uiOut = false;
    this.isShown.uiInn = false;
    this.isShown.visualwhile= false;
    this.isShown.visualfor = false;
    this.isShown.visualIf = false;
    this.isShown.setting = false;
    this.isShown.create = false;
    this.isShown.endgame =false;
    this.isShown.cond = false;
    this.isShown.turn = false;
    this.isShown.actions = false;
  }

  endgame():void{
    this.isShown.endgame =true;
    this.isShown.nNetwork=false;
    this.isShown.board =false;
    this.isShown.math = false; 
    this.isShown.predefined = false;
    this.isShown.return = false; 
    this.isShown.tile = false; 
    this.isShown.player=false ;
    this.isShown.uiOut = false;
    this.isShown.uiInn = false;
    this.isShown.visualwhile= false;
    this.isShown.visualfor = false;
    this.isShown.visualIf = false;
    this.isShown.setting = false;
    this.isShown.create = false;
    this.isShown.cond = false;
    this.isShown.turn = false;
    this.isShown.actions = false;
  }

  showConditions():void{
    this.isShown.cond = true; 
    this.isShown.endgame =false;
    this.isShown.nNetwork=false;
    this.isShown.board =false;
    this.isShown.math = false; 
    this.isShown.predefined = false;
    this.isShown.return = false; 
    this.isShown.tile = false; 
    this.isShown.player=false ;
    this.isShown.uiOut = false;
    this.isShown.uiInn = false;
    this.isShown.visualwhile= false;
    this.isShown.visualfor = false;
    this.isShown.visualIf = false; 
    this.isShown.setting = false;
    this.isShown.create = false;
    this.isShown.turn = false;
    this.isShown.actions = false;
  }

  showActions():void{
    this.isShown.actions = true; 
    this.isShown.turn = false; 
    this.isShown.create = false;
    this.isShown.setting = false;
    this.isShown.visualIf = false;
    this.isShown.visualfor=false;
    this.isShown.visualwhile=false;
    this.isShown.uiOut = false;
    this.isShown.uiInn = false;
    this.isShown.nNetwork=false;
    this.isShown.endgame =false;
    this.isShown.math = false; 
    this.isShown.predefined = false;
    this.isShown.return = false; 
    this.isShown.tile = false; 
    this.isShown.player=false ;
    this.isShown.board = false;
    this.isShown.cond = false;
  }

  showTurn(){
    this.isShown.turn = true;
    this.isShown.actions = false;  
    this.isShown.create = false;
    this.isShown.setting = false;
    this.isShown.visualIf = false;
    this.isShown.visualfor=false;
    this.isShown.visualwhile=false;
    this.isShown.uiOut = false;
    this.isShown.uiInn = false;
    this.isShown.nNetwork=false;
    this.isShown.endgame =false;
    this.isShown.math = false; 
    this.isShown.predefined = false;
    this.isShown.return = false; 
    this.isShown.tile = false; 
    this.isShown.player=false ;
    this.isShown.board = false;
    this.isShown.cond = false;
  }
}
