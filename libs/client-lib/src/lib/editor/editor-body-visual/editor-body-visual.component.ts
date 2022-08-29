import { Component, OnInit, Input } from '@angular/core';
import { ElementTemplateComponent } from './element-template';


@Component({
  selector: 'board-game-companion-app-editor-body-visual',
  templateUrl: './editor-body-visual.component.html',
  styleUrls: ['./editor-body-visual.component.scss'],
})
export class EditorBodyVisualComponent {
  
  destIndex = 0

  Game = [
    {title: '', class: '' , pos: 0}
  ]

  Endgame = [
    {title: '', class: '' , pos: 0}
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
