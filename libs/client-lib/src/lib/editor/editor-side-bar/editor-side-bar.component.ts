import { Component, OnInit, Input } from '@angular/core';
//import * as ace from 'apps/client/src/assets/js/ace-editor/src-min/ace'

@Component({
  selector: 'board-game-companion-app-editor-side-bar',
  templateUrl: './editor-side-bar.component.html',
  styleUrls: ['./editor-side-bar.component.scss'],
})
export class EditorSideBarComponent implements OnInit{
  @Input() height = 0;
  @Input() width = 0;
  
  ngOnInit(): void {
    console.log("editor");
    //const codeEditor = ace.edit("codeEditor");    
  }

}
