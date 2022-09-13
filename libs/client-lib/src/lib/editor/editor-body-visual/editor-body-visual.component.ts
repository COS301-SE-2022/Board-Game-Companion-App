import { Component, OnInit, Input } from '@angular/core';


@Component({
  selector: 'board-game-companion-app-editor-body-visual',
  templateUrl: './editor-body-visual.component.html',
  styleUrls: ['./editor-body-visual.component.scss'],
})
export class EditorBodyVisualComponent {
  
  endLoopIndex = 0
  playersLoopIndex = 0
  cardsLoopIndex = 0

  Tiles = [
    {variable: '', id: '', name: '', type: ''}
  ]

  Endgame = [
    {title: '', class: '' , id: '', pos: 0, true: 0, false: 0}
  ]

  Player1 = [
    {title: '', class: '' , id: '', pos: 0, true: 0, false: 0}
  ]

  Player2 = [
    {title: '', class: '' , id: '', pos: 0, true: 0, false: 0}
  ]

  Players = [
    {name: "", actionNames: [""], actionParams: [[""]], turnParams: [""], conditionParams: [""], actions: [[{title: '', class: '' , id: '', pos: 0, true: 0, false: 0}]], conditions: [[{title: '', class: '' , id: '', pos: 0, true: 0, false: 0}]], turn: [[{title: '', class: '' , id: '', pos: 0, true: 0, false: 0}]]},
    {name: "", actionNames: [""], actionParams: [[""]], turnParams: [""], conditionParams: [""],actions: [[{title: '', class: '' , id: '', pos: 0, true: 0, false: 0}]], conditions: [[{title: '', class: '' , id: '', pos: 0, true: 0, false: 0}]], turn: [[{title: '', class: '' , id: '', pos: 0, true: 0, false: 0}]]}
  ]

  PlayersLoops = [
    this.Player1
  ]

  Cards = [{effect: [{title: '', class: '' , id: '', pos: 0, true: 0, false: 0}], condition: [{title: '', class: '' , id: '', pos: 0, true: 0, false: 0}]}]

  CardsLoop = [
    [{title: '', class: '' , id: '', pos: 0, true: 0, false: 0}]
  ]

  EndgameLoops = [
    this.Endgame
  ]

  methods = [
    {name: 'addToBoard', arguments: 1},
    {name: 'addPieceToTile', arguments: 2},
    {name: 'addToArr', arguments: 2}
  ]

  addNewPlayer()
  {
    this.Players.push({name: "", actionNames: [""], actionParams: [[""]], turnParams: [""], conditionParams: [""], actions: [[{title: '', class: '' , id: '', pos: 0, true: 0, false: 0}]], conditions: [[{title: '', class: '' , id: '', pos: 0, true: 0, false: 0}]], turn: [[{title: '', class: '' , id: '', pos: 0, true: 0, false: 0}]]})
  }

  addNewCard()
  {
    this.Cards.push({effect: [{title: '', class: '' , id: '', pos: 0, true: 0, false: 0}], condition: [{title: '', class: '' , id: '', pos: 0, true: 0, false: 0}]})
  }

  addTileToBoard()
  {
    this.Tiles.push({variable: '', id: '', name: '', type: ''})
  }

  removeTile(i: number)
  {
    this.Tiles.splice(i, 1)
  }

  clear()
  {
    this.Tiles.splice(0)
    this.Players.splice(2)
  }
}
