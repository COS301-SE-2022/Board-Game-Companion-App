import { Component, OnInit, Input } from '@angular/core';


@Component({
  selector: 'board-game-companion-app-editor-body-visual',
  templateUrl: './editor-body-visual.component.html',
  styleUrls: ['./editor-body-visual.component.scss'],
})
export class EditorBodyVisualComponent {
  
  endLoopIndex = 0
  gameLoopIndex = 0

  Game = [
    {title: '', class: '' , id: '', pos: 0}
  ]

  Endgame = [
    {title: '', class: '' , id: '', pos: 0}
  ]

  Player1 = [
    {title: '', class: '' , id: '', pos: 0}
  ]

  Player2 = [
    {title: '', class: '' , id: '', pos: 0}
  ]

  Players = [
    {action: [{title: '', class: '' , id: '', pos: 0}], condition: [{title: '', class: '' , id: '', pos: 0}], turn: [{title: '', class: '' , id: '', pos: 0}]},
    {action: [{title: '', class: '' , id: '', pos: 0}], condition: [{title: '', class: '' , id: '', pos: 0}], turn: [{title: '', class: '' , id: '', pos: 0}]}
  ]

  PlayersLoops = [
    this.Player1
  ]

  GameLoops = [
    this.Game
  ]

  EndgameLoops = [
    this.Endgame
  ]

  methods = [
    {name: 'addToBoard', arguments: 1},
    {name: 'addPieceToTile', arguments: 2},
    {name: 'addToArr', arguments: 2}
  ]
}
