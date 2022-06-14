import { Component, OnInit } from '@angular/core';
//import * as ace from 'apps/client/src/assets/js/ace-editor/src-min/ace'

@Component({
  selector: 'board-game-companion-app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss'],
})
export class EditorComponent implements OnInit{
    
  ngOnInit(): void {
    console.log("editor");
    //const codeEditor = ace.edit("codeEditor");    
  }

}
