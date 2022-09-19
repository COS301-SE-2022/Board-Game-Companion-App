import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'board-game-companion-app-editor-visual-side-bar',
  templateUrl: './editor-visual-side-bar.component.html',
  styleUrls: ['./editor-visual-side-bar.component.scss'],
})
export class EditorVisualsComponent {

  origin = [
    {title: 'Create',  class: 'visualC', id: '', pos: 0},
    {title: 'Set',  class: 'visualS', id: '', pos: 0},
    {title: 'Input',  class: 'visualIn', id: '', pos: 0},
    {title: 'Output', class: 'visualO', id: '', pos: 0},
    {title: 'Call', class: 'visualM', id: '', pos: 0},
    {title: 'If', class: 'visualIf', id: '', pos: 0},
    {title: 'Return', class: 'visualR', id: '', pos: 0},
    {title: 'For', class: 'visualF', id: '', pos: 0},
    {title: 'While', class: 'visualW', id: '', pos: 0},
    {title: 'doWhile', class: 'visualD', id: '', pos: 0}
  ];

  ngOnInit(): void{
    const k = document.getElementById("area") as HTMLElement
    // console.log(k)
  }

  
}
