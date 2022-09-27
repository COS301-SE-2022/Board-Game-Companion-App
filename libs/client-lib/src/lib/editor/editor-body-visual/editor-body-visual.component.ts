import { Component, OnInit, Output, EventEmitter} from '@angular/core';


@Component({
  selector: 'board-game-companion-app-editor-body-visual',
  templateUrl: './editor-body-visual.component.html',
  styleUrls: ['./editor-body-visual.component.scss'],
})
export class EditorBodyVisualComponent {
  
  endLoopIndex = 0
  playersLoopIndex = 0
  cardsLoopIndex = 0
  @Output() propertyName = new EventEmitter<string>()

  Properties = [
    {Property: "", Value: "", Line: ""}
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
    {name: 'movePiece', arguments: 2},
    {name: 'activate', arguments: 2},
    {name: 'removeFromArr', arguments: 2},
    {name: 'chooseAction', arguments: 2},
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
    this.Properties.push({Property: "", Value: "", Line: ""})

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

  updatePropertyName(event: any, i : number)
  {
    if(this.Properties[i].Value == '')
    {
      this.Properties[i].Property = event.target.value
    }
    else
    {
      this.Properties[i].Property = event.target.value
      this.propertyName.emit(event.target.value + " name " + this.Properties[i].Line + " " + i.toString())
    }
   
  }

  updatePropertyValue(event: any, i : number)
  {
    if(this.Properties[i].Property == '')
    {
      this.Properties[i].Value = event.target.value
    }
    else
    {
      this.Properties[i].Value = event.target.value
      this.propertyName.emit(event.target.value + " value " + this.Properties[i].Line + " " + i.toString())
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
    this.endLoopIndex = 0
    this.listProperties.splice(2)
    this.Properties.splice(0)
    this.EndgameLoops.splice(1)
    this.Endgame.splice(0)
  }
}
