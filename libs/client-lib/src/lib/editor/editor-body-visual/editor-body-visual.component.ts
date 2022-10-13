import { Component, OnInit, Output, EventEmitter} from '@angular/core';
import { ConnectableObservable } from 'rxjs';


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
  @Output() removeProperties = new EventEmitter<string>()
  @Output() addTile = new EventEmitter<number>()
  @Output() removeTiles = new EventEmitter<number>()
  @Output() editTiles = new EventEmitter<string>()
  @Output() updatePlayer = new EventEmitter<string>()
  @Output() addPlayers = new EventEmitter<number>()
  @Output() removePlayers = new EventEmitter<number>()
  @Output() removeActionConditions = new EventEmitter<string>()
  @Output() addActionConditions = new EventEmitter<number>()
  @Output() addCards = new EventEmitter<number>()
  @Output() removeCards = new EventEmitter<number>()
  @Output() updateCards = new EventEmitter<string>()
  @Output() updateElements = new EventEmitter<string>()


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
    this.Endgame.splice(0)
  }

  Variables = [{name: "", value: ""} ]

  Endgame = [
    {title: '', class: '' , id: '', inputs: ["","","","","","","",""], pos: 0, true: 0, false: 0, lineNumber: ""}
  ]

  Players = [
    {name: "", actionNames: [""], actionParams: [""], turnParams: [""], conditionParams: [""], actions: [[{title: '', class: '' , id: '', inputs: ["","","","","","","",""], pos: 0, true: 0, false: 0, lineNumber: ""}]], conditions: [[{title: '', class: '' , id: '', inputs: ["","","","","","","",""], pos: 0, true: 0, false: 0, lineNumber: ""}]], turn: [[{title: '', class: '' , id: '', inputs: ["","","","","","","",""], pos: 0, true: 0, false: 0, lineNumber: ""}]], playerCode: [[{title: '', class: '' , id: '', inputs: ["","","","","","","",""], pos: 0, true: 0, false: 0, lineNumber: ""}]]},
  ]

  PlayersLoops = [
    [{title: '', class: '' , id: '', inputs: ["","","","","","","",""], pos: 0, true: 0, false: 0, lineNumber: ""}]
  ]

  Cards = [{name: "", parameter: "", effect: [{title: '', class: '' , id: '', inputs: ["","","","","","","",""], pos: 0, true: 0, false: 0, lineNumber: ""}], condition: [{title: '', class: '' , id: '', inputs: ["","","","","","","",""], pos: 0, true: 0, false: 0, lineNumber: ""}]}]

  CardsLoop = [
    [{title: '', class: '' , id: '', inputs: ["","","","","","","",""], pos: 0, true: 0, false: 0, lineNumber: ""}]
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
    this.Players.push( {name: "", actionNames: [""], actionParams: [""], turnParams: [""], conditionParams: [""], actions: [[{title: '', class: '' , id: '', inputs: ["","","","","","","",""], pos: 0, true: 0, false: 0, lineNumber: ""}]], conditions: [[{title: '', class: '' , id: '', inputs: ["","","","","","","",""], pos: 0, true: 0, false: 0, lineNumber: ""}]], turn: [[{title: '', class: '' , id: '', inputs: ["","","","","","","",""], pos: 0, true: 0, false: 0, lineNumber: ""}]], playerCode: [[{title: '', class: '' , id: '', inputs: ["","","","","","","",""], pos: 0, true: 0, false: 0, lineNumber: ""}]]})
    this.addPlayers.emit(this.Players.length-1)
  }

  removePlayer(event : any)
  {
    this.removePlayers.emit(event)
  }

  playerName(event : any)
  {
    const name = event.split(/\s/)
    if(this.Players[+name[1]].actionNames[0] == "")
    {
      this.Players[+name[1]].name = name[0]
      this.updatePlayer.emit("name " + event)
    }
    else
    {
      this.updatePlayer.emit("name " + event)
    }
  }

  actionName(event : any)
  {
    const name = event.split(/\s/)
    if(name[0] == "")
    {
      name.shift()
    }
    if(this.Players[+name[1]].actionNames[0] == "")
    {
      this.Players[+name[1]].actionNames[+name[2]] = name[0]
      this.updatePlayer.emit("action " + event)
    }
    else
    {
      this.updatePlayer.emit("action " + event)
    }
  }

  actionParam(event : any)
  {
    const name = event.split(/\s/)
    if(name[0] == "")
    {
      name.shift()
    }
    if(this.Players[+name[1]].actionParams[0] == "")
    {
      this.Players[+name[1]].actionParams[+name[2]] = name[0]
      this.updatePlayer.emit("actionParam " + event)
    }
    else
    {
      this.updatePlayer.emit("actionParam " + event)
    }
  }

  conditionParam(event : any)
  {
    const name = event.split(/\s/)
    if(name[0] == "")
    {
      name.shift()
    }
    if(this.Players[+name[1]].conditionParams[0] == "")
    {
      this.Players[+name[1]].conditionParams[+name[2]] = name[0]
      this.updatePlayer.emit("conditionParam " + event)
    }
    else
    {
      this.updatePlayer.emit("conditionParam " + event)
    }
  }

  addActionCondition(event : any)
  {
    this.addActionConditions.emit(event)
  }

  removeActionCondition(event : any)
  {
    this.removeActionConditions.emit(event)
  }

  addNewCard()
  {
    this.Cards.push({name: "", parameter: "", effect: [{title: '', class: '' , id: '', inputs: ["","","","","","","",""], pos: 0, true: 0, false: 0, lineNumber: ""}], condition: [{title: '', class: '' , id: '', inputs: ["","","","","","","",""], pos: 0, true: 0, false: 0, lineNumber: ""}]})
    this.addCards.emit(this.Cards.length)
  }

  addProperty()
  {
    this.Properties.push({Property: "", Value: "", Line: ""})

  }

  removeProperty(i: number)
  {
    const obj = this.Properties[i]
    this.Properties.splice(i, 1)
    this.listProperties.splice(2 + i, 1)
    this.removeProperties.emit(obj.Line)
  }

  addTileToBoard()
  {
    this.Tiles.push({values: new Array<string>(this.listProperties.length)})
    this.addTile.emit(this.Tiles.length)
  }

  removeTile(i: number)
  {
    const obj = this.Properties[i]
    this.Tiles.splice(i, 1)
    this.removeTiles.emit(i)
  }

  editTile(event: any, i: number, property: number)
  {
    this.Tiles[i].values[property] = event.target.value
    this.editTiles.emit(event.target.value + " " + i + " " + property)
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

  removeCard(event : any)
  {
    this.removeCards.emit(event)
  }

  updateCard(event : any)
  {
    const name = event.split(/\s/)
    if(name[0] == "")
    {
      name.shift()
    }
    this.updateCards.emit(event)
  }

  updateElement(event : any)
  {
    this.updateElements.emit(event)
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
