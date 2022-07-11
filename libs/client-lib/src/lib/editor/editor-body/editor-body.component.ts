import { Component, Input, OnInit } from '@angular/core';
import * as ace from "ace-builds";
import { ScriptService } from '../../shared/services/scripts/script.service';

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
  @Input()openFiles:file[] = [];
  focusFile = 0;

  constructor(private readonly scriptService:ScriptService){

  }

  ngOnInit(): void {
    const theme = localStorage.getItem("board-game-companion-script-editor-theme");

    if(theme != null)
      this.themeEditor = theme;

    this.createEditor();
    //this.loadFocusFile();
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

  loadFocusFile(name:string): void{
    if(this.openFiles.length > 0){


      this.scriptService.getFileData(this.openFiles[this.focusFile].location).subscribe({
        next:(value)=>{
          console.log(value);
        },
        error:(e)=>{
          console.log(e)
        },
        complete:()=>{
          console.log("complete")
        }
      });
    }
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
