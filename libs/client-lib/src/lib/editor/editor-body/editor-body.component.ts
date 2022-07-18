import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as ace from "ace-builds";
import { find } from '../../shared/models/find';
import { replace } from '../../shared/models/replace';
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
  @Input()scriptId = "";
  sendChangesTimer = 0;
  showFindCheck = true;
  showReplaceCheck = true;
  constructor(private readonly scriptService:ScriptService){
    
  }

  ngOnInit(): void {
    const theme = localStorage.getItem("board-game-companion-script-editor-theme");

    if(theme != null)
      this.themeEditor = theme;

    this.createEditor();
    
    this.codeEditor.session.on('change', (delta:any)=>{
      //console.log(delta);
      this.changesTracker.emit(1);
      this.sendChanges();
  
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

  getCode(): string{
    return this.codeEditor.getValue();
  }


  undo(): void{
    this.codeEditor.undo();
  }

  redo(): void{
    this.codeEditor.redo();
  }

  copy(): void{
    const text = this.codeEditor.getCopyText();
    navigator.clipboard.writeText(text);
  }

  cut(): void{
    const text = this.codeEditor.getCopyText();
    this.codeEditor.execCommand("cut");
    navigator.clipboard.writeText(text);
  }

  paste(): void{
    const editor = this.codeEditor;

    navigator.clipboard.read().then((items)=>{
      for(let count = 0; count < items.length; count++){
        if(items[count].types.includes("text/plain")){
          items[count].getType("text/plain").then(function(blob){
              blob.text().then(function(text){
                  editor.session.insert(editor.getCursorPosition(), text);
              });
          });        
        }
      }
    })
  }

  find(value:find): void{
    console.log(value);

    this.codeEditor.find(value.text,{
      backwards: false,
      wrap: value.wrap,
      caseSensitive: value.caseSensitive,
      wholeWord: value.wholeWord,
      regExp: value.regularExpression
    })
  }

  findNext(): void{
    this.codeEditor.findNext();
  }

  findPrevious(): void{
    this.codeEditor.findPrevious();
  }

  replace(value:replace): void{
    this.codeEditor.find(value.text,{
      backwards: false,
      wrap: value.wrap,
      caseSensitive: value.caseSensitive,
      wholeWord: value.wholeWord,
      regExp: value.regularExpression
    })

    this.codeEditor.replace(value.replace);
  }

  replaceAll(value:replace): void{
    this.codeEditor.find(value.text);

    this.codeEditor.replaceAll(value.replace);    
  }

  sendChanges(): void{
    clearTimeout(this.sendChangesTimer);
    this.sendChangesTimer = window.setTimeout(()=>{
      this.scriptService.updateFile(this.scriptId,this.codeEditor.getValue()).subscribe({
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
