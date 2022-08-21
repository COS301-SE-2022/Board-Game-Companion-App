import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'board-game-companion-app-editor-visuals',
  templateUrl: './editor-visuals.component.html',
  styleUrls: ['./editor-visuals.component.scss'],
})
export class EditorVisualsComponent implements OnInit {

  origin = [
    {title: 'Create',  class: 'visualC', pos: 0},
    {title: 'Set',  class: 'visualS', pos: 0},
    {title: 'Input',  class: 'visualIn', pos: 0},
    {title: 'Output', class: 'visualO', pos: 0},
    {title: 'Call', class: 'visualM', pos: 0},
    {title: 'If', class: 'visualIf', pos: 0},
    {title: 'Return', class: 'visualR', pos: 0},
    {title: 'For', class: 'visualF', pos: 0},
    {title: 'While', class: 'visualW', pos: 0},
    {title: 'doWhile', class: 'visualD', pos: 0}
  ];
  constructor() {}

  ngOnInit(): void {}
}
