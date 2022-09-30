import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'board-game-companion-app-editor-visual-side-bar',
  templateUrl: './editor-visual-side-bar.component.html',
  styleUrls: ['./editor-visual-side-bar.component.scss'],
})
export class EditorVisualsComponent {

  origin = [
    {title: 'Create',  class: 'visualC', id: '', inputs: ["","","","","","","",""], pos: 0, true: 0, false: 0},
    {title: 'Set',  class: 'visualS', id: '', inputs: ["","","","","","","",""], pos: 0,  true: 0, false: 0},
    {title: 'Input',  class: 'visualIn', id: '', inputs: ["","","","","","","",""], pos: 0,  true: 0, false: 0},
    {title: 'Output', class: 'visualO', id: '', inputs: ["","","","","","","",""], pos: 0,  true: 0, false: 0},
    {title: 'Call', class: 'visualM', id: '', inputs: ["","","","","","","",""], pos: 0,  true: 0, false: 0},
    {title: 'If', class: 'visualIf', id: '', inputs: ["","","","","","","",""], pos: 0,  true: 0, false: 0},
    {title: 'Return', class: 'visualR', id: '', inputs: ["","","","","","","",""], pos: 0,  true: 0, false: 0},
    {title: 'For', class: 'visualF', id: '', inputs: ["","","","","","","",""], pos: 0,  true: 0, false: 0},
    {title: 'While', class: 'visualW', id: '', inputs: ["","","","","","","",""], pos: 0,  true: 0, false: 0},
    {title: 'doWhile', class: 'visualD', id: '', inputs: ["","","","","","","",""], pos: 0,  true: 0, false: 0}
  ];

  ngOnInit(): void{
    const k = document.getElementById("area") as HTMLElement
    // console.log(k)
  }

  
}
