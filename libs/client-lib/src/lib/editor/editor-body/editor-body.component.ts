import { Component, EventEmitter, Input, OnInit, OnChanges ,Output, OnDestroy } from '@angular/core';
import { valueAndGrads } from '@tensorflow/tfjs';
import * as ace from "ace-builds";
import { DragulaService } from 'ng2-dragula';
import { entity } from '../../shared/models/entity';
import { find } from '../../shared/models/find';
import { replace } from '../../shared/models/replace';
import { selection } from '../../shared/models/selection';
import { ScriptService } from '../../shared/services/scripts/script.service';
import {EditorBodyVisualComponent} from '../editor-body-visual/editor-body-visual.component';
import { Subscription } from 'rxjs';

interface file{
  name:string;
  location:string;
}

@Component({
  selector: 'board-game-companion-app-editor-body',
  templateUrl: './editor-body.component.html',
  styleUrls: ['./editor-body.component.scss'],
})
export class EditorBodyComponent implements OnInit,OnDestroy{
 
  @Input() height = 0;
  @Input() width = 0;
  @Input() margin = 0;
  @Input() top = 0;
  @Output() changesTracker = new EventEmitter<number>();
  @Output() newMessageEvent = new EventEmitter<string>();
  @Output() newProgramStructureEvent = new EventEmitter<entity>();
  @Output() cursorChangeEvent = new EventEmitter<ace.Ace.Point>();
  codeEditor!:ace.Ace.Editor;
  themeEditor = "Dracula";
  @Input()scriptId = "";
  @Input()fileLocation = "";
  sendChangesTimer = 0;
  showFindCheck = true;
  showReplaceCheck = true;
  cursorCheckerTimer = 0;
  cursorPosition:ace.Ace.Point = {row:1,column:1};
  dragula = new Subscription()

  constructor(private readonly scriptService:ScriptService, private readonly dragulaService: DragulaService){
    
  }

  ngOnInit(): void {

    this.dragula.add(this.dragulaService.drop('COPYABLE')
    .subscribe(({name, el, target, source, sibling}) => {
        console.log(name)
        console.log(el)
        console.log(target)
        console.log(source)
        console.log(sibling)
      })
    );
    
    const theme = localStorage.getItem("board-game-companion-script-editor-theme");

    if(theme != null)
      this.themeEditor = theme;

    this.createEditor();

    
    
    clearInterval(this.cursorCheckerTimer);
    this.codeEditor.navigateTo(0,0);

    this.cursorCheckerTimer = window.setInterval(()=>{
      const value = this.codeEditor.getCursorPosition();
      
      if(value.row != this.cursorPosition.row || value.column != this.cursorPosition.column){
        this.cursorChangeEvent.emit({row:value.row + 1,column:value.column + 1});
        this.cursorPosition = value;
      }
    },500);
    
  }

  ngOnDestroy(): void {
    clearInterval(this.cursorCheckerTimer);    
  }

  ngOnChanges(): void{
    //console.log("changes: " + this.fileLocation);

    if(this.fileLocation !== ""){
      this.scriptService.getFileData(this.fileLocation).subscribe({
        next:(value)=>{
          this.codeEditor.setValue(value);
          this.codeEditor.navigateTo(0,0);
          
          this.codeEditor.session.on('change', ()=>{
            this.changesTracker.emit(1);
            this.sendChanges();
        
          });
        },
        error:(e)=>{
          console.log(e);
        }
      })
    }
  }

  createEditor():void{
    this.codeEditor =  ace.edit("editor-content"); 
    this.codeEditor.setTheme("ace/theme/" + this.themeEditor.toLowerCase());
    this.codeEditor.resize();
    this.codeEditor.session.setMode("ace/mode/automatascript");
    this.codeEditor.setOptions({
      fontFamily: 'monospace',
      fontSize: '12pt',
      enableLiveAutocompletion: true
    });

  }

  changeDisplay(value: boolean): void
  {
    if(value)
    {
      const e = document.getElementById("editor-content") as HTMLElement
      const v = document.getElementById("visual-content") as HTMLElement
      e.style.display = "none"
      v.style.display = "block"
    }
    else
    {
      const e = document.getElementById("editor-content") as HTMLElement
      const v = document.getElementById("visual-content") as HTMLElement
      e.style.display = "block"
      v.style.display = "none"
    }
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

    this.codeEditor.find(value.text,{
      backwards: false,
      wrap: value.wrap,
      caseSensitive: value.caseSensitive,
      wholeWord: value.wholeWord
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
      wholeWord: value.wholeWord
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
          if(value.status === "success"){
            this.changesTracker.emit(2);
            this.newProgramStructureEvent.emit(value.programStructure);
          }else{
            this.changesTracker.emit(0);
          }
          console.log()
          this.newMessageEvent.emit(value.message);
          console.log(value);
        },
        error:(e)=>{
          //console.log(e);
          this.changesTracker.emit(0);
        }
      })
    },3000);
  }

  highlight(value:selection): void{
    
    this.codeEditor.scrollToRow(value.startLine - 1)

    this.codeEditor.selection.setRange(new ace.Range(value.startLine - 1,value.startPosition - 1,value.endLine - 1,value.endPosition));
  }

  remove(value:selection): void{
    this.highlight(value);
    this.cut();
  }

}
