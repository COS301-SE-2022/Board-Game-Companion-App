import { Component, Input, OnInit } from '@angular/core';
import * as ace from "ace-builds";


interface file{
  name:string;
  location:string;
}

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
  codeEditor:any;
  themeEditor = "Dracula";
  openFiles:file[] = [];

  ngOnInit(): void {
    const theme = localStorage.getItem("board-game-companion-script-editor-theme");

    if(theme != null)
      this.themeEditor = theme;

    this.openFiles.push({name:"main.js",location:"a"});
    this.openFiles.push({name:"model.js",location:"b"});
    this.openFiles.push({name:"generate.js",location:"c"});
    this.openFiles.push({name:"interface.json",location:"d"});
    this.createEditor();
  }

  createEditor():void{
    this.codeEditor =  ace.edit("editor-content"); 
    this.codeEditor.setTheme("ace/theme/" + this.themeEditor.toLowerCase());
    this.codeEditor.resize();
    this.codeEditor.session.setMode("ace/mode/javascript");
    this.codeEditor.setOptions({
      fontFamily: 'monospace',
      fontSize: '12pt',
      enableLiveAutocompletion: true
    });

  }

  addOpenFile(val:file):void{
    this.openFiles.push(val);
  }

  removeOpenFile(val:file):void{
    const temp:file[] = [];

    for(let count = 0; count < this.openFiles.length; count++){
      if(this.openFiles[count].location != val.location)
        temp.push(this.openFiles[count]);
    }
    
    this.openFiles = temp;
  }

  getCode(): string{
    let result = "";

    for(let count = 0; count < this.codeEditor.length; count++)
      result += this.codeEditor[count].content.getValue();

    return result;
  }


}
