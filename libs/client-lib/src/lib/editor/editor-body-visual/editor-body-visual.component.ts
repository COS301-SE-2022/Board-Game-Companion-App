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

  Properties = [
    {Property: "", Value: ""}
  ]

  listProperties = [
    "id", "name", "type"
  ]

  Tiles = [
    {values: new Array<string>(this.listProperties.length)} 
  ]

  constructor(){
    this.Properties.splice(0)
    this.Tiles.splice(0)
    this.Players.splice(0)
    this.Cards.splice(0)
  }

  Variables = [{name: "", value: ""} ]

  Endgame = [
    {title: '', class: '' , id: '', inputs: ["","","","","","","",""], pos: 0, true: 0, false: 0}
  ]

  Players = [
    {name: "", actionNames: [""], actionParams: [""], turnParams: [""], conditionParams: [""], actions: [[{title: '', class: '' , id: '', inputs: ["","","","","","","",""], pos: 0, true: 0, false: 0}]], conditions: [[{title: '', class: '' , id: '', inputs: ["","","","","","","",""], pos: 0, true: 0, false: 0}]], turn: [[{title: '', class: '' , id: '', inputs: ["","","","","","","",""], pos: 0, true: 0, false: 0}]], playerCode: [[{title: '', class: '' , id: '', inputs: ["","","","","","","",""], pos: 0, true: 0, false: 0}]]},
  ]

  PlayersLoops = [
    [{title: '', class: '' , id: '', inputs: ["","","","","","","",""], pos: 0, true: 0, false: 0}]
  ]

  Cards = [{name: "", parameter: "", effect: [{title: '', class: '' , id: '', inputs: ["","","","","","","",""], pos: 0, true: 0, false: 0}], condition: [{title: '', class: '' , id: '', inputs: ["","","","","","","",""], pos: 0, true: 0, false: 0}]}]

  CardsLoop = [
    [{title: '', class: '' , id: '', inputs: ["","","","","","","",""], pos: 0, true: 0, false: 0}]
  ]

  EndgameLoops = [
    this.Endgame
  ]

  methods = [
    {name: 'addToBoard', arguments: 1},
    {name: 'addPieceToTile', arguments: 2},
    {name: 'addToArr', arguments: 2},
    {name: 'movePiece', arguments: 2}
  ]

  addNewPlayer()
  {
    this.Players.push( {name: "", actionNames: [""], actionParams: [""], turnParams: [""], conditionParams: [""], actions: [[{title: '', class: '' , id: '', inputs: ["","","","","","","",""], pos: 0, true: 0, false: 0}]], conditions: [[{title: '', class: '' , id: '', inputs: ["","","","","","","",""], pos: 0, true: 0, false: 0}]], turn: [[{title: '', class: '' , id: '', inputs: ["","","","","","","",""], pos: 0, true: 0, false: 0}]], playerCode: [[{title: '', class: '' , id: '', inputs: ["","","","","","","",""], pos: 0, true: 0, false: 0}]]})
  }

  addNewCard()
  {
    this.Cards.push({name: "", parameter: "", effect: [{title: '', class: '' , id: '', inputs: ["","","","","","","",""], pos: 0, true: 0, false: 0}], condition: [{title: '', class: '' , id: '', inputs: ["","","","","","","",""], pos: 0, true: 0, false: 0}]})
  }

  addProperty()
  {
    this.Properties.push({Property: "", Value: ""})
  }

  removeProperty(i: number)
  {
    this.Properties.splice(i, 1)
    this.listProperties.splice(3 + i, 1)
  }

  addTileToBoard()
  {
    console.log(this.Tiles)
    this.Tiles.push({values: new Array<string>(this.listProperties.length)})
  }

  removeTile(i: number)
  {
    this.Tiles.splice(i, 1)
  }

  updateProperties(event: any, i:number)
  {
    if(this.listProperties[3 + i] == null && !this.listProperties.includes(event.target.value))
    {
      this.listProperties.push(event.target.value)
    }
    else
    {
      this.listProperties[3 + i] = event.target.value
    }
    
  }

  clear()
  {
    this.Tiles.splice(0)
    for(let j = 0; j < this.Players.length; j++)
    {
      for(let i = 0; i < this.Players[j].actions.length; i++)
      {
        this.Players[j].actions[i].splice(0)
        this.Players[j].conditions[i].splice(0)
        this.Players[j].turn[0].splice(0)
        this.Players[j].playerCode[0].splice(0)
      }
    }
    this.Players.splice(0)
    for(let j = 0; j < this.Cards.length; j++)
    {
      this.Cards[j].condition.splice(0)
      this.Cards[j].effect.splice(0)
    }
    this.Cards.splice(0)
    this.Variables.splice(0)
    this.PlayersLoops.splice(1)
    this.CardsLoop.splice(1)
    this.playersLoopIndex = 0
    this.cardsLoopIndex = 0
    this.listProperties.splice(2)
    this.Properties.splice(0)
  }
}
