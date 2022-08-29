import { Component, OnInit, Input } from '@angular/core';
import { ElementTemplateComponent } from './element-template';


@Component({
  selector: 'board-game-companion-app-editor-body-visual',
  templateUrl: './editor-body-visual.component.html',
  styleUrls: ['./editor-body-visual.component.scss'],
})
export class EditorBodyVisualComponent implements OnInit {
  
  destIndex = 0

  dest = [
    {title: '', class: '' , pos: 0}
  ]

  dests = [
    this.dest
  ]

  methods = [
    {name: 'addToBoard', arguments: 1},
    {name: 'addPieceToTile', arguments: 2},
    {name: 'addToArr', arguments: 2}
  ]

  ngOnInit(): void 
  {
    console.log(this.dest)
    
  }
}
