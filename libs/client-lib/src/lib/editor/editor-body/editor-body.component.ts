import { Component, Input, OnInit } from '@angular/core';
import * as ace from "ace-builds";

@Component({
  selector: 'board-game-companion-app-editor-body',
  templateUrl: './editor-body.component.html',
  styleUrls: ['./editor-body.component.scss'],
})
export class EditorBodyComponent implements OnInit{
  @Input() height = 0;
  @Input() width = 0;
  @Input() margin = 0;
  @Input() top = 0;
  codeEditor:any = null;

  ngOnInit(): void {
    console.log("editor-tool-bar");   
    this.codeEditor = ace.edit("editor");
    this.codeEditor.setTheme("ace/theme/dracula");
    this.codeEditor.resize();
    this.codeEditor.session.setMode("ace/mode/javascript");
    this.codeEditor.setOptions({
      fontFamily: 'monospace',
      fontSize: '12pt',
      enableBasicAutocompletion: true,
      enableLiveAutocompletion: true
    });
  }

  getCode(): string{
    return this.codeEditor.getValue();
  }


}
