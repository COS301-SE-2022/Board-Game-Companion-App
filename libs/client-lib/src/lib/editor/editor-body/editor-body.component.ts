import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as ace from "ace-builds";
import { String } from 'aws-sdk/clients/apigateway';
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
  @Output() changesTracker = new EventEmitter<number>();
  codeEditor:any;
  themeEditor = "Dracula";
  @Input()openFiles:file[] = [];
  @Input()scriptId = "";
  focusFile = "";
  sendChangesTimer = 0;

  constructor(private readonly scriptService:ScriptService){
    
  }

  ngOnInit(): void {
    const theme = localStorage.getItem("board-game-companion-script-editor-theme");

    if(theme != null)
      this.themeEditor = theme;

    this.createEditor();
    
    this.codeEditor.session.on('change', (delta:any)=>{
      //console.log(delta);
      if(this.focusFile !== ""){
        this.changesTracker.emit(1);
        this.sendChanges(this.focusFile);
      }
    });
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
      this.focusFile = name;
      this.scriptService.getFileData(this.openFiles[this.focusFile  === "main.js" ? 0 : 1].location).subscribe({
        next:(value)=>{
          this.codeEditor.session.setValue(value,-1);
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
      else{
        if(this.focusFile == val.name){
          let newFocusIndex = count;

          if(count + 1 >= this.openFiles.length){
            if(count - 1 >= 0)
              newFocusIndex--;
            else
              continue;
          }else
            newFocusIndex++;

          this.loadFocusFile(this.openFiles[newFocusIndex].name);
        }
      }
    }
    
    this.openFiles = temp;
  }

  getCode(): string{
    return this.codeEditor.getValue();
  }

  sendChanges(name:string): void{
    clearTimeout(this.sendChangesTimer);
    this.sendChangesTimer = window.setTimeout(()=>{
      this.scriptService.updateFile(this.scriptId,name,this.codeEditor.getValue()).subscribe({
        next:(value)=>{
          console.log(value)
          if(value.message === "success")
            this.changesTracker.emit(2);
          else
            this.changesTracker.emit(0);
        },
        error:(e)=>{
          console.log(e);
          this.changesTracker.emit(0);
        },
        complete:()=>{
          console.log("complete")
        }
      })
    },3000);
  }

}
