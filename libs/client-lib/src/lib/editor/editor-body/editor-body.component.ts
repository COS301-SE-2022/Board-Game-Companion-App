import { Component, EventEmitter, Input, OnInit ,Output, OnDestroy, ViewChild, ViewContainerRef } from '@angular/core';
import * as ace from "ace-builds";
import { DragulaService } from 'ng2-dragula';
import { entity } from '../../shared/models/editor/entity';
import { find } from '../../shared/models/editor/find';
import { replace } from '../../shared/models/editor/replace';
import { selection } from '../../shared/models/editor/selection';
import { EditorService } from '../../shared/services/editor/editor.service';
import {EditorBodyVisualComponent} from '../editor-body-visual/editor-body-visual.component';
import { Subscription } from 'rxjs';
import { ConsoleLogger } from '@nestjs/common';
import { NgForOf } from '@angular/common';
import { EventListenerFocusTrapInertStrategy } from '@angular/cdk/a11y';
import { Console } from 'console';
import { CollectionsModule } from '../../collections/collections.module';
import { transpilationResponse } from '../../shared/models/editor/transpilationResponse';

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
  @Output() newMessageEvent = new EventEmitter<string[]>();
  @Output() newProgramStructureEvent = new EventEmitter<entity>();
  @Output() cursorChangeEvent = new EventEmitter<ace.Ace.Point>();
  @ViewChild(EditorBodyVisualComponent) editorVisual: EditorBodyVisualComponent = new EditorBodyVisualComponent();
  @ViewChild('anchor', {read: ViewContainerRef}) anchor !: ViewContainerRef;
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
  count = 0
  @Input() eID = 0

  constructor(private readonly editorService:EditorService, private readonly dragulaService: DragulaService){
    
  }

  ngOnInit(): void {
    this.dragula.add(this.dragulaService.drop('COPYABLE')
    .subscribe(({name, el, target, source, sibling}) => {
      //Check if new element added or swapping elements
      console.log(this.count)
      console.log(this.editorVisual.Players)
      if(source !== target)
      {
        if(document.getElementById("endGame")?.contains(target))
        {
          this.count++
          //Endgame Container
          //need to find which loop it belongs to
          let recent = this.editorVisual.Endgame.findIndex((obj) => {
            return obj.id === "e" + this.count.toString()
          })
          //If not in general area must be in one of the loops.
          if(recent === -1)
          {
            let index = 0
            for(let j = 0; j < this.editorVisual.EndgameLoops.length; j++)
            {
              //Check which loop it is in.
              recent = this.editorVisual.EndgameLoops[j].findIndex((obj) => {
                return obj.id === "e" + this.count.toString()
              })
              if(recent !== -1)
              {
                index = j
                break
              }
            }
            switch(el.id)
            {
              case "visualF": 
              case "visualW":
              case "VisualD": 
              {
                this.editorVisual.endLoopIndex++
                this.editorVisual.EndgameLoops[index][recent].pos = this.editorVisual.endLoopIndex
                const dest = [
                  {title: '', class: '' , id: '', inputs: ["","","","","","","",""], pos: 0, true: 0, false: 0}
                ]
                this.editorVisual.EndgameLoops.push(dest)
                
                break
              }
              case "visualIf":
              {
                this.editorVisual.endLoopIndex++
                this.editorVisual.EndgameLoops[index][recent].true = this.editorVisual.endLoopIndex
                const dest = [
                  {title: '', class: '' , id: '', inputs: ["","","","","","","",""], pos: 0, true: 0, false: 0}
                ]
                this.editorVisual.EndgameLoops.push(dest)
                this.editorVisual.endLoopIndex++
                this.editorVisual.EndgameLoops[index][recent].false = this.editorVisual.endLoopIndex
                this.editorVisual.EndgameLoops.push(dest)
                break
              }
                
              
            }
          }
          else
          {
            switch(el.id)
            {
              case "visualF": 
              case "visualW":
              case "VisualD":
              {
                if(target.parentElement !== null && document.getElementById("endGame")?.contains(target))
                {
                  this.editorVisual.endLoopIndex++
                  this.editorVisual.Endgame[recent].pos = this.editorVisual.endLoopIndex
                  const dest = [
                    {title: '', class: '' , id: '', inputs: ["","","","","","","",""], pos: 0, true: 0, false: 0}
                  ]
                  this.editorVisual.EndgameLoops.push(dest)
                }
                break
              }
              case "visualIf":
              {
                this.editorVisual.endLoopIndex++
                this.editorVisual.Endgame[recent].true = this.editorVisual.endLoopIndex
                const dest = [
                  {title: '', class: '' , id: '', inputs: ["","","","","","","",""], pos: 0, true: 0, false: 0}
                ]
                this.editorVisual.EndgameLoops.push(dest)
                this.editorVisual.endLoopIndex++
                this.editorVisual.Endgame[recent].false = this.editorVisual.endLoopIndex
                this.editorVisual.EndgameLoops.push(dest)
                break
              }
            }
          }
        }
        else if(document.getElementById("player")?.contains(target))
        {
          //Players
          let player = 0
          let position = 0
          let property = ""
          let recent = this.editorVisual.Endgame.findIndex((obj) => {
            return obj.id === "e" + this.count.toString()
          })
          //need to find which player it belongs to
          for(let j = 0; j < this.editorVisual.Players.length; j++)
          {
            //Go through that players actions.
            for(let i = 0; i < this.editorVisual.Players[j].actions.length; i++)
            {
              recent = this.editorVisual.Players[j].actions[i].findIndex((obj) => {
                return obj.id === "e" + this.count.toString()
              })

              if(recent !== -1)
              {
                player = j
                position = i
                property = "action"
                break
              }
            }

            if(property !== "")
            {
              break
            }
            //Go through that players conditions
            for(let i = 0; i < this.editorVisual.Players[j].conditions.length; i++)
            {
              recent = this.editorVisual.Players[j].conditions[i].findIndex((obj) => {
                return obj.id === "e" + this.count.toString()
              })

              if(recent !== -1)
              {
                console.log(this.editorVisual.Players[j].conditions[i])
                player = j
                position = i
                property = "condition"
                break
              }
            }

            if(property !== "")
            {
              break
            }

            //Go through players turn
            recent = this.editorVisual.Players[j].turn[0].findIndex((obj) => {
              return obj.id === "e" + this.count.toString()
            })

            if(recent !== -1)
            {
              player = j
              property = "turn"
              console.log("Turn")
              break
            }
          }

          //If not in general player container else go to loops
          if(property === "")
          {
            let index = 0
            for(let j = 0; j < this.editorVisual.PlayersLoops.length; j++)
            {
              //Check which loop it is in.
              recent = this.editorVisual.PlayersLoops[j].findIndex((obj) => {
                return obj.id === "e" + this.count.toString()
              })
              if(recent !== -1)
              {
                index = j
                break
              }
            }
            switch(el.id)
            {
              case "visualF": 
              case "visualW":
              case "VisualD": 
              {
                this.editorVisual.playersLoopIndex++
                this.editorVisual.PlayersLoops[index][recent].pos = this.editorVisual.playersLoopIndex
                const dest = [
                  {title: '', class: '' , id: '', inputs: ["","","","","","","",""], pos: 0, true: 0, false: 0}
                ]
                this.editorVisual.PlayersLoops.push(dest)
                break
              }
              case "visualIf":
              {
                this.editorVisual.playersLoopIndex++
                this.editorVisual.PlayersLoops[index][recent].true = this.editorVisual.playersLoopIndex
                const dest = [
                  {title: '', class: '' , id: '', inputs: ["","","","","","","",""], pos: 0, true: 0, false: 0}
                ]
                this.editorVisual.PlayersLoops.push(dest)
                this.editorVisual.playersLoopIndex++
                this.editorVisual.PlayersLoops[index][recent].false = this.editorVisual.playersLoopIndex
                this.editorVisual.PlayersLoops.push(dest)
                break
              }
              
            }
          } 
          else
          {
            switch(property)
            {
              case "action":
                switch(el.id)
                {
                  case "visualF": 
                  case "visualW":
                  case "VisualD":
                  {
                    this.editorVisual.playersLoopIndex++
                    this.editorVisual.Players[player].actions[position][recent].pos = this.editorVisual.playersLoopIndex
                    const dest = [
                      {title: '', class: '' , id: '', inputs: ["","","","","","","",""], pos: 0, true: 0, false: 0}
                    ]
                    this.editorVisual.PlayersLoops.push(dest)
                  }
                  break
                  case "visualIf":
                  {
                    this.editorVisual.playersLoopIndex++
                    this.editorVisual.Players[player].actions[position][recent].true = this.editorVisual.playersLoopIndex
                    const dest = [
                      {title: '', class: '' , id: '', inputs: ["","","","","","","",""], pos: 0, true: 0, false: 0}
                    ]
                    this.editorVisual.PlayersLoops.push(dest)
                    this.editorVisual.playersLoopIndex++
                    this.editorVisual.Players[player].actions[position][recent].false = this.editorVisual.playersLoopIndex
                    this.editorVisual.PlayersLoops.push(dest)
                    break
                  }

                }
                break
              case "condition":
                switch(el.id)
                {
                  case "visualF": 
                  case "visualW":
                  case "VisualD":
                  {
                    this.editorVisual.playersLoopIndex++
                    this.editorVisual.Players[player].conditions[position][recent].pos = this.editorVisual.playersLoopIndex
                    const dest = [
                      {title: '', class: '' , id: '', inputs: ["","","","","","","",""], pos: 0, true: 0, false: 0}
                    ]
                    this.editorVisual.PlayersLoops.push(dest)
                  }
                  break
                  case "visualIf":
                  {
                    this.editorVisual.playersLoopIndex++
                    console.log(this.editorVisual.Players[player].conditions[position][recent])
                    this.editorVisual.Players[player].conditions[position][recent].true = this.editorVisual.playersLoopIndex
                    const dest = [
                      {title: '', class: '' , id: '', inputs: ["","","","","","","",""], pos: 0, true: 0, false: 0}
                    ]
                    this.editorVisual.PlayersLoops.push(dest)
                    this.editorVisual.playersLoopIndex++
                    this.editorVisual.Players[player].conditions[position][recent].false = this.editorVisual.playersLoopIndex
                    this.editorVisual.PlayersLoops.push(dest)
                    break
                  }

                }
                break
              case "turn":
                switch(el.id)
                {
                  case "visualF": 
                  case "visualW":
                  case "VisualD":
                  {
                    this.editorVisual.playersLoopIndex++
                    this.editorVisual.Players[player].turn[0][recent].pos = this.editorVisual.playersLoopIndex
                    const dest = [
                      {title: '', class: '' , id: '', inputs: ["","","","","","","",""], pos: 0, true: 0, false: 0}
                    ]
                    this.editorVisual.PlayersLoops.push(dest)
                  }
                  break
                  case "visualIf":
                  {
                    this.editorVisual.playersLoopIndex++
                    this.editorVisual.Players[player].turn[0][recent].true = this.editorVisual.playersLoopIndex
                    const dest = [
                      {title: '', class: '' , id: '', inputs: ["","","","","","","",""], pos: 0, true: 0, false: 0}
                    ]
                    this.editorVisual.PlayersLoops.push(dest)
                    this.editorVisual.playersLoopIndex++
                    this.editorVisual.Players[player].turn[0][recent].false = this.editorVisual.playersLoopIndex
                    this.editorVisual.PlayersLoops.push(dest)
                    break
                  }

                }
                break
            }
          }
        }
        else if(document.getElementById("card")?.contains(target))
        {
          console.log("cards")
          //Cards
          let card = 0
          let property = ""
          let recent = this.editorVisual.Endgame.findIndex((obj) => {
            return obj.id === "e" + this.count.toString()
          })
          //need to find which card it belongs to
          for(let j = 0; j < this.editorVisual.Cards.length; j++)
          {
            //Go through cards effect
             recent = this.editorVisual.Cards[j].effect.findIndex((obj) => {
              return obj.id === "e" + this.count.toString()
            })

            console.log(this.editorVisual.Cards)

            if(recent !== -1)
            {
              console.log("yebo")
              card = j
              property = "effect"
              break
            }

            //Go through cards condition
            recent = this.editorVisual.Cards[j].condition.findIndex((obj) => {
              return obj.id === "e" + this.count.toString()
            })

            if(recent !== -1)
            {
              card = j
              property = "condition"
              break
            }
          }

          //If not in general card container else go to loops
          if(property === "")
          {
            let index = 0
            for(let j = 0; j < this.editorVisual.CardsLoop.length; j++)
            {
              //Check which loop it is in.
              recent = this.editorVisual.CardsLoop[j].findIndex((obj) => {
                return obj.id === "e" + this.count.toString()
              })
              if(recent !== -1)
              {
                index = j
                break
              }
            }
            switch(el.id)
            {
              case "visualF": 
              case "visualW":
              case "VisualD": 
              {
                this.editorVisual.cardsLoopIndex++
                this.editorVisual.CardsLoop[index][recent].pos = this.editorVisual.cardsLoopIndex
                const dest = [
                  {title: '', class: '' , id: '', inputs: ["","","","","","","",""], pos: 0, true: 0, false: 0}
                ]
                this.editorVisual.CardsLoop.push(dest)
                break
              }
              case "visualIf":
              {
                this.editorVisual.cardsLoopIndex++
                this.editorVisual.CardsLoop[index][recent].true = this.editorVisual.cardsLoopIndex
                const dest = [
                  {title: '', class: '' , id: '', inputs: ["","","","","","","",""], pos: 0, true: 0, false: 0}
                ]
                this.editorVisual.CardsLoop.push(dest)
                this.editorVisual.cardsLoopIndex++
                this.editorVisual.CardsLoop[index][recent].false = this.editorVisual.cardsLoopIndex
                this.editorVisual.CardsLoop.push(dest)
                break
              }
            
            }
          }
          else
          {
            switch(property)
            {
              case "effect":
                switch(el.id)
                {
                  case "visualF": 
                  case "visualW":
                  case "VisualD": 
                  {
                    this.editorVisual.cardsLoopIndex++
                    this.editorVisual.Cards[card].effect[recent].pos = this.editorVisual.cardsLoopIndex
                    const dest = [
                      {title: '', class: '' , id: '', inputs: ["","","","","","","",""], pos: 0, true: 0, false: 0}
                    ]
                    this.editorVisual.CardsLoop.push(dest)
                    break
                  }
                  case "visualIf":
                  {
                    this.editorVisual.cardsLoopIndex++
                    this.editorVisual.Cards[card].effect[recent].true = this.editorVisual.cardsLoopIndex
                    const dest = [
                      {title: '', class: '' , id: '', inputs: ["","","","","","","",""], pos: 0, true: 0, false: 0}
                    ]
                    this.editorVisual.CardsLoop.push(dest)
                    this.editorVisual.cardsLoopIndex++
                    this.editorVisual.Cards[card].effect[recent].false = this.editorVisual.cardsLoopIndex
                    this.editorVisual.CardsLoop.push(dest)
                    break
                  }
                  
                }
                break
              case "condition":
                switch(el.id)
                {
                  case "visualF": 
                  case "visualW":
                  case "VisualD": 
                  {
                    this.editorVisual.cardsLoopIndex++
                    this.editorVisual.Cards[card].condition[recent].pos = this.editorVisual.cardsLoopIndex
                    const dest = [
                      {title: '', class: '' , id: '', inputs: ["","","","","","","",""], pos: 0, true: 0, false: 0}
                    ]
                    this.editorVisual.CardsLoop.push(dest)
                    break
                  }
                  case "visualIf":
                  {
                    this.editorVisual.cardsLoopIndex++
                    this.editorVisual.Cards[card].condition[recent].true = this.editorVisual.cardsLoopIndex
                    const dest = [
                      {title: '', class: '' , id: '', inputs: ["","","","","","","",""], pos: 0, true: 0, false: 0}
                    ]
                    this.editorVisual.CardsLoop.push(dest)
                    this.editorVisual.cardsLoopIndex++
                    this.editorVisual.Cards[card].condition[recent].false = this.editorVisual.cardsLoopIndex
                    this.editorVisual.CardsLoop.push(dest)
                    break
                  }
                  
                }
                break
            }
          }
        }
        

        
        
        
        
      }
       
    }));
    
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
      this.editorService.getFileData(this.fileLocation).subscribe({
        next:(value)=>{
          this.codeEditor.setValue(value);
          this.codeEditor.navigateTo(0,0);
          //this.updateVDSL()
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
      //Console.log happens
      this.editorService.updateFile(this.scriptId,this.codeEditor.getValue()).subscribe({
        next:(value:transpilationResponse)=>{
          if(value.status === "success"){
            //UpdateLineArray()
            //this.updateVDSL()
            this.changesTracker.emit(2);
            this.newProgramStructureEvent.emit(value.structure as entity);
            this.newMessageEvent.emit([value.message]);
          }else{
            this.changesTracker.emit(0);
            
            if(value.errors.length === 0)
              this.newMessageEvent.emit([value.message]);
            else
              this.newMessageEvent.emit(value.errors);
          }
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

  getEID()
  {
    this.count++
    this.eID++
    return ("e" + this.eID.toString())
  }

  getConditionParams(l : string)
  {
    const params = []
    const conditions = (l.match(/&&/g) || []).length + (l.match(/\|\|/g) || []).length + 1
    const AndOr = l.match(/&& | \|\|/g)
    let aoIndex = 0
    const condi = l.substring(l.indexOf("(") + 1, l.indexOf(")")).replace(/\s/g, '').split(/[&&,||]/)
    params.push(conditions.toString())
    //console.log(lines[j].split("&&"))
    condi.forEach((line) => {
      if(line.includes(">") && !line.includes("="))
      {
        const a = line.split(/>/)
        params.push(a[0])
        params.push(">")
        params.push(a[1])
        if(AndOr != null)
        {
          if(AndOr[aoIndex] != null)
          {
            params.push(AndOr[aoIndex])
            aoIndex++
          }
        }
      }
      else if(line.includes("<") && !line.includes("="))
      {
        const a = line.split(/</)
        params.push(a[0])
        params.push("<")
        params.push(a[1])
        if(AndOr != null)
        {
          if(AndOr[aoIndex] != null)
          {
            params.push(AndOr[aoIndex])
            aoIndex++
          }
        }
      }
      else if(line.includes("=="))
      {
        const a = line.split(/==/)
        params.push(a[0])
        params.push("==")
        params.push(a[1])
        if(AndOr != null)
        {
          if(AndOr[aoIndex] != null)
          {
            params.push(AndOr[aoIndex])
            aoIndex++
          }
        }
      }
      else if(line.includes("!="))
      {
        const a = line.split(/!=/)
        params.push(a[0])
        params.push("!=")
        params.push(a[1])
        if(AndOr != null)
        {
          if(AndOr[aoIndex] != null)
          {
            params.push(AndOr[aoIndex])
            aoIndex++
          }
        }
      }
      else if(line.includes(">="))
      {
        const a = line.split(/>=/)
        params.push(a[0])
        params.push(">=")
        params.push(a[1])
        if(AndOr != null)
        {
          if(AndOr[aoIndex] != null)
          {
            params.push(AndOr[aoIndex])
            aoIndex++
          }
        }
      }
      else if(line.includes("<="))
      {
        const a = line.split(/<=/)
        params.push(a[0])
        params.push("<=")
        params.push(a[1])
        if(AndOr != null)
        {
          if(AndOr[aoIndex] != null)
          {
            params.push(AndOr[aoIndex])
            aoIndex++
          }
        }
      }
      else if(line.includes("!"))
      {
        params.push(line.substring(line.indexOf("(")+1))
        params.push("!=")
        params.push("true")
        if(AndOr != null)
        {
          if(AndOr[aoIndex] != null)
          {
            params.push(AndOr[aoIndex])
            aoIndex++
          }
        }
      }
      else
      {
        params.push(line.substring(line.indexOf("(")+1))
        params.push("==")
        params.push("true")
        if(AndOr != null)
        {
          if(AndOr[aoIndex] != null)
          {
            params.push(AndOr[aoIndex])
            aoIndex++
          }
        }
      }
    })

    return params
  }

  ifCreation(parent : string)
  {
    const dest = [
      {title: '', class: '' , id: '', inputs: ["","","","","","","",""], pos: 0, true: 0, false: 0}
    ]
    const dest2 = [
      {title: '', class: '' , id: '', inputs: ["","","","","","","",""], pos: 0, true: 0, false: 0}
    ]
    switch(parent)
    {
      case "player":
        {
          this.editorVisual.playersLoopIndex++
          this.editorVisual.PlayersLoops.push(dest)
          this.editorVisual.playersLoopIndex++
          this.editorVisual.PlayersLoops.push(dest2)
        }
        break
      case "card":
        {
          this.editorVisual.cardsLoopIndex++
          this.editorVisual.CardsLoop.push(dest)
          this.editorVisual.cardsLoopIndex++
          this.editorVisual.CardsLoop.push(dest2)
        }
        break
      case "endGame":
        {
          this.editorVisual.endLoopIndex++
          this.editorVisual.EndgameLoops.push(dest)
          this.editorVisual.endLoopIndex++
          this.editorVisual.EndgameLoops.push(dest2)
        }
        break
    }
    
  }

  loopCreation(parent : string)
  {
    const dest = [
      {title: '', class: '' , id: '', inputs: ["","","","","","","",""], pos: 0, true: 0, false: 0}
    ]
    switch(parent)
    {
      case "player":
        this.editorVisual.PlayersLoops.push(dest)
        break
      case "card":
        this.editorVisual.CardsLoop.push(dest)
        break
      case "endGame":
        this.editorVisual.EndgameLoops.push(dest)
        break
    }
   
  }

  letCreation(l : string[], openIf : number, player : number, action : number, ifContains : number, method : string, parent : string, card : number)
  {
    const id = this.getEID()
    if(openIf > 0)
    {
      switch(parent)
      {
        case "player":
          this.editorVisual.PlayersLoops[ifContains].push({title: 'Create',  class: 'visualC', id: id, inputs: [l[2],l[4].replace(/'/g, ""),"","","","","",""], pos: 0, true: 0, false: 0})
          break
        case "card":
          this.editorVisual.CardsLoop[ifContains].push({title: 'Create',  class: 'visualC', id: id, inputs: [l[2],l[4].replace(/'/g, ""),"","","","","",""], pos: 0, true: 0, false: 0})
          break
        case "endGame":
          this.editorVisual.EndgameLoops[ifContains].push({title: 'Create',  class: 'visualC', id: id, inputs: [l[2],l[4].replace(/'/g, ""),"","","","","",""], pos: 0, true: 0, false: 0})
          break
      }
      
    }
    else
    {
      switch(method)
      {
        case "action":
          this.editorVisual.Players[player].actions[action].push({title: 'Create',  class: 'visualC', id: id, inputs: [l[2],l[4].replace(/'/g, ""),"","","","","",""], pos: 0, true: 0, false: 0})
          break
        case "condition":
          switch(parent)
          {
            case "player":
              this.editorVisual.Players[player].conditions[action].push({title: 'Create',  class: 'visualC', id: id, inputs: [l[2],l[4].replace(/'/g, ""),"","","","","",""], pos: 0, true: 0, false: 0})
              break
            case "card":
              this.editorVisual.Cards[card].condition.push({title: 'Create',  class: 'visualC', id: id, inputs: [l[2],l[4].replace(/'/g, ""),"","","","","",""], pos: 0, true: 0, false: 0})
              break
          }    
          break
        case "turn":
          this.editorVisual.Players[player].turn[0].push({title: 'Create',  class: 'visualC', id: id, inputs: [l[2],l[4].replace(/'/g, ""),"","","","","",""], pos: 0, true: 0, false: 0})
          break
        case "endGame":
          this.editorVisual.Endgame.push({title: 'Create',  class: 'visualC', id: id, inputs: [l[2],l[4].replace(/'/g, ""),"","","","","",""], pos: 0, true: 0, false: 0})
          break
        case "effect":
          this.editorVisual.Cards[card].effect.push({title: 'Create',  class: 'visualC', id: id, inputs: [l[2],l[4].replace(/'/g, ""),"","","","","",""], pos: 0, true: 0, false: 0})
          break
      }
      
    }
    this.editorVisual.Variables.push({name: l[2], value: l[4].replace(/'/g, "")})
    this.editorVisual.listProperties.forEach((element) => {
      this.editorVisual.Variables.push({name: l[2] + "." + element, value: ""})
    })
  }

  setCreation(lines: string[], j : number, l : string[], openIf : number, ifContains: number, player: number, action: number, method : string, parent : string, card : number)
  {
    const id = this.getEID()
    const set = this.editorVisual.Variables.find(vars => vars.name === l[1])
    if(set != null)
    {
      if(openIf > 0)
      {
        switch(parent)
        {
          case "player":
            this.editorVisual.PlayersLoops[ifContains].push({title: 'Set',  class: 'visualS', id: id, inputs: [set?.name, lines[j].substring(lines[j].indexOf("=") + 1),"","","","","",""], pos: 0, true: 0, false: 0})
            break
          case "card":
            this.editorVisual.CardsLoop[ifContains].push({title: 'Set',  class: 'visualS', id: id, inputs: [set?.name, lines[j].substring(lines[j].indexOf("=") + 1),"","","","","",""], pos: 0, true: 0, false: 0})
            break
          case "endGame":
            this.editorVisual.EndgameLoops[ifContains].push({title: 'Set',  class: 'visualS', id: id, inputs: [set?.name, lines[j].substring(lines[j].indexOf("=") + 1),"","","","","",""], pos: 0, true: 0, false: 0})
            break
        }
      }
      else
      {
        switch(method)
        {
          case "action":
            this.editorVisual.Players[player].actions[action].push({title: 'Set',  class: 'visualS', id: id, inputs: [set?.name, lines[j].substring(lines[j].indexOf("=") + 1),"","","","","",""], pos: 0, true: 0, false: 0})
            break
          case "condition":
            switch(parent)
            {
              case "player":
                this.editorVisual.Players[player].conditions[action].push({title: 'Set',  class: 'visualS', id: id, inputs: [set?.name, lines[j].substring(lines[j].indexOf("=") + 1),"","","","","",""], pos: 0, true: 0, false: 0})
                break
              case "card":
                this.editorVisual.Cards[card].condition.push({title: 'Set',  class: 'visualS', id: id, inputs: [set?.name, lines[j].substring(lines[j].indexOf("=") + 1),"","","","","",""], pos: 0, true: 0, false: 0})
                break
            }
            break
          case "turn":
            this.editorVisual.Players[player].turn[0].push({title: 'Set',  class: 'visualS', id: id, inputs: [set?.name, lines[j].substring(lines[j].indexOf("=") + 1),"","","","","",""], pos: 0, true: 0, false: 0})
            break
          case "endGame":
            this.editorVisual.Endgame.push({title: 'Set',  class: 'visualS', id: id, inputs: [set?.name, lines[j].substring(lines[j].indexOf("=") + 1),"","","","","",""], pos: 0, true: 0, false: 0})
            break
          case "playerCodeArea":
            this.editorVisual.Players[player].playerCode[0].push({title: 'Set',  class: 'visualS', id: id, inputs: [set?.name, lines[j].substring(lines[j].indexOf("=") + 1),"","","","","",""], pos: 0, true: 0, false: 0})
            break
          case "effect":
            this.editorVisual.Cards[card].effect.push({title: 'Set',  class: 'visualS', id: id, inputs: [set?.name, lines[j].substring(lines[j].indexOf("=") + 1),"","","","","",""], pos: 0, true: 0, false: 0})
            break
        }
       
      }  
    }
  }

  ioCreation(lines: string[], j : number, openIf : number, ifContains: number, player: number, action: number, method : string, title : string, classes : string, parent : string, card : number)
  {
    const id = this.getEID()
    let input = [""]
    if(lines[j].match(/"(.*?)"/g) != null)
    {
      input = lines[j].match(/"(.*?)"/g) || []
    }
    else if(lines[j].match(/'(.*?)'/g) != null)
    {
      input = lines[j].match(/'(.*?)'/g) || []
    }
    if(openIf > 0)
    {
      switch(parent)
      {
        case "player":
          this.editorVisual.PlayersLoops[ifContains].push({title: title, class: classes, id: id, inputs: [input[0],"","","","","","",""], pos: 0, true: 0, false: 0})
          break
        case "card":
          this.editorVisual.CardsLoop[ifContains].push({title: title, class: classes, id: id, inputs: [input[0],"","","","","","",""], pos: 0, true: 0, false: 0})
          break
        case "endGame":
          this.editorVisual.EndgameLoops[ifContains].push({title: title, class: classes, id: id, inputs: [input[0],"","","","","","",""], pos: 0, true: 0, false: 0})
          break
      }
    }
    else
    {
      switch(method)
      {
        case "action":
          this.editorVisual.Players[player].actions[action].push({title: title, class: classes, id: id, inputs: [input[0],"","","","","","",""], pos: 0, true: 0, false: 0})
          break
        case "condition":
          switch(parent)
          {
            case "player":
              this.editorVisual.Players[player].conditions[action].push({title: title, class: classes, id: id, inputs: [input[0],"","","","","","",""], pos: 0, true: 0, false: 0})
              break
            case "card":
              this.editorVisual.Cards[card].condition.push({title: title, class: classes, id: id, inputs: [input[0],"","","","","","",""], pos: 0, true: 0, false: 0})
              break
          }
          break
        case "turn":
          this.editorVisual.Players[player].turn[0].push({title: title, class: classes, id: id, inputs: [input[0],"","","","","","",""], pos: 0, true: 0, false: 0})
          break
        case "endGame":
          this.editorVisual.Endgame.push({title: title, class: classes, id: id, inputs: [input[0],"","","","","","",""], pos: 0, true: 0, false: 0})
          break
        case "effect":
          this.editorVisual.Cards[card].effect.push({title: title, class: classes, id: id, inputs: [input[0],"","","","","","",""], pos: 0, true: 0, false: 0})
          break
      }
      
    } 
  }

  methodCreation(lines: string[], j : number, l : string[], openIf : number, ifContains: number, player: number, action: number, method : string, parent : string, card : number)
  {
    const id = this.getEID()
    const call = this.editorVisual.methods.find(method => method.name === l[1].substring(0, l[1].indexOf("(")))
    if(call != null)
    {
      if(call.arguments === 1)
      {
        if(openIf > 0)
        {
          switch(parent)
          {
            case "player":
              this.editorVisual.PlayersLoops[ifContains].push({title: 'Call', class: 'visualM', id: id, inputs: [call.name, call.arguments.toString(), lines[j].substring(lines[j].indexOf("(") + 1, lines[j].length-1),"","","","",""], pos: 0, true: 0, false: 0})
              break
            case "card":
              this.editorVisual.CardsLoop[ifContains].push({title: 'Call', class: 'visualM', id: id, inputs: [call.name, call.arguments.toString(), lines[j].substring(lines[j].indexOf("(") + 1, lines[j].length-1),"","","","",""], pos: 0, true: 0, false: 0})
              break
            case "endGame":
              this.editorVisual.EndgameLoops[ifContains].push({title: 'Call', class: 'visualM', id: id, inputs: [call.name, call.arguments.toString(), lines[j].substring(lines[j].indexOf("(") + 1, lines[j].length-1),"","","","",""], pos: 0, true: 0, false: 0})
              break
          } 
        }
        else
        {
          switch(method)
          {
            case "action":
              this.editorVisual.Players[player].actions[action].push({title: 'Call', class: 'visualM', id: id, inputs: [call.name, call.arguments.toString(), lines[j].substring(lines[j].indexOf("(") + 1, lines[j].length-1),"","","","",""], pos: 0, true: 0, false: 0})
              break
            case "condition":
              switch(parent)
              {
                case "player":
                  this.editorVisual.Players[player].conditions[action].push({title: 'Call', class: 'visualM', id: id, inputs: [call.name, call.arguments.toString(), lines[j].substring(lines[j].indexOf("(") + 1, lines[j].length-1),"","","","",""], pos: 0, true: 0, false: 0})
                  break
                case "card":
                  this.editorVisual.Cards[card].condition.push({title: 'Call', class: 'visualM', id: id, inputs: [call.name, call.arguments.toString(), lines[j].substring(lines[j].indexOf("(") + 1, lines[j].length-1),"","","","",""], pos: 0, true: 0, false: 0})
                  break
              }
              break
            case "turn":
              this.editorVisual.Players[player].turn[0].push({title: 'Call', class: 'visualM', id: id, inputs: [call.name, call.arguments.toString(), lines[j].substring(lines[j].indexOf("(") + 1, lines[j].length-1),"","","","",""], pos: 0, true: 0, false: 0})
              break
            case "endGame":
              this.editorVisual.Endgame.push({title: 'Call', class: 'visualM', id: id, inputs: [call.name, call.arguments.toString(), lines[j].substring(lines[j].indexOf("(") + 1, lines[j].length-1),"","","","",""], pos: 0, true: 0, false: 0})
              break
            case "effect":
              this.editorVisual.Cards[card].effect.push({title: 'Call', class: 'visualM', id: id, inputs: [call.name, call.arguments.toString(), lines[j].substring(lines[j].indexOf("(") + 1, lines[j].length-1),"","","","",""], pos: 0, true: 0, false: 0})
              break
          }
        }
      }
      else
      {
        if(openIf > 0)
        {
          switch(parent)
          {
            case "player":
              this.editorVisual.PlayersLoops[ifContains].push({title: 'Call', class: 'visualM', id: id, inputs: [call.name, call.arguments.toString(), lines[j].substring(lines[j].indexOf("(") + 1, lines[j].indexOf(",")), lines[j].substring(lines[j].indexOf(",") + 1, lines[j].length-1),"","","",""], pos: 0, true: 0, false: 0})
              break
            case "card":
              this.editorVisual.CardsLoop[ifContains].push({title: 'Call', class: 'visualM', id: id, inputs: [call.name, call.arguments.toString(), lines[j].substring(lines[j].indexOf("(") + 1, lines[j].indexOf(",")), lines[j].substring(lines[j].indexOf(",") + 1, lines[j].length-1),"","","",""], pos: 0, true: 0, false: 0})
              break
            case "endGame":
              this.editorVisual.EndgameLoops[ifContains].push({title: 'Call', class: 'visualM', id: id, inputs: [call.name, call.arguments.toString(), lines[j].substring(lines[j].indexOf("(") + 1, lines[j].indexOf(",")), lines[j].substring(lines[j].indexOf(",") + 1, lines[j].length-1),"","","",""], pos: 0, true: 0, false: 0})
              break
          }
        }
        else
        {
          switch(method)
          {
            case "action":
              this.editorVisual.Players[player].actions[action].push({title: 'Call', class: 'visualM', id: id, inputs: [call.name, call.arguments.toString(), lines[j].substring(lines[j].indexOf("(") + 1, lines[j].indexOf(",")), lines[j].substring(lines[j].indexOf(",") + 1, lines[j].length-1),"","","",""], pos: 0, true: 0, false: 0})
              break
            case "condition":
              switch(parent)
              {
                case "player":
                  this.editorVisual.Players[player].conditions[action].push({title: 'Call', class: 'visualM', id: id, inputs: [call.name, call.arguments.toString(), lines[j].substring(lines[j].indexOf("(") + 1, lines[j].indexOf(",")), lines[j].substring(lines[j].indexOf(",") + 1, lines[j].length-1),"","","",""], pos: 0, true: 0, false: 0})
                  break
                case "card":
                  this.editorVisual.Cards[card].condition.push({title: 'Call', class: 'visualM', id: id, inputs: [call.name, call.arguments.toString(), lines[j].substring(lines[j].indexOf("(") + 1, lines[j].indexOf(",")), lines[j].substring(lines[j].indexOf(",") + 1, lines[j].length-1),"","","",""], pos: 0, true: 0, false: 0})
                  break
              }
              break
            case "turn":
              this.editorVisual.Players[player].turn[0].push({title: 'Call', class: 'visualM', id: id, inputs: [call.name, call.arguments.toString(), lines[j].substring(lines[j].indexOf("(") + 1, lines[j].indexOf(",")), lines[j].substring(lines[j].indexOf(",") + 1, lines[j].length-1),"","","",""], pos: 0, true: 0, false: 0})
              break
            case "endGame":
              this.editorVisual.Endgame.push({title: 'Call', class: 'visualM', id: id, inputs: [call.name, call.arguments.toString(), lines[j].substring(lines[j].indexOf("(") + 1, lines[j].indexOf(",")), lines[j].substring(lines[j].indexOf(",") + 1, lines[j].length-1),"","","",""], pos: 0, true: 0, false: 0})
              break
            case "effect":
              this.editorVisual.Cards[card].effect.push({title: 'Call', class: 'visualM', id: id, inputs: [call.name, call.arguments.toString(), lines[j].substring(lines[j].indexOf("(") + 1, lines[j].indexOf(",")), lines[j].substring(lines[j].indexOf(",") + 1, lines[j].length-1),"","","",""], pos: 0, true: 0, false: 0})
              break
          } 
        }
      }
    }
  }

  returnCreation(lines: string[], j : number, openIf : number, ifContains: number, player: number, action: number, method : string, parent : string, card : number)
  {
    const id = this.getEID()
    const input = lines[j].split(' ').join('');
    if(openIf > 0)
    {
      switch(parent)
      {
        case "player":
          this.editorVisual.PlayersLoops[ifContains].push({title: 'Return', class: 'visualR', id: id, inputs: [input.substring(input.indexOf("n") + 1),"","","","","","",""], pos: 0, true: 0, false: 0})
          break
        case "card":
          this.editorVisual.CardsLoop[ifContains].push({title: 'Return', class: 'visualR', id: id, inputs: [input.substring(input.indexOf("n") + 1),"","","","","","",""], pos: 0, true: 0, false: 0})
          break
        case "endGame":
          this.editorVisual.EndgameLoops[ifContains].push({title: 'Return', class: 'visualR', id: id, inputs: [input.substring(input.indexOf("n") + 1),"","","","","","",""], pos: 0, true: 0, false: 0})
          break
      }
    }
    else
    {
      switch(method)
      {
        case "action":
          this.editorVisual.Players[player].actions[action].push({title: 'Return', class: 'visualR', id: id, inputs: [input.substring(input.indexOf("n") + 1),"","","","","","",""], pos: 0, true: 0, false: 0})
          break
        case "condition":
          switch(parent)
          {
            case "player":
              this.editorVisual.Players[player].conditions[action].push({title: 'Return', class: 'visualR', id: id, inputs: [input.substring(input.indexOf("n") + 1),"","","","","","",""], pos: 0, true: 0, false: 0})
              break
            case "card":
              this.editorVisual.Cards[card].condition.push({title: 'Return', class: 'visualR', id: id, inputs: [input.substring(input.indexOf("n") + 1),"","","","","","",""], pos: 0, true: 0, false: 0})
              break
          }   
          break
        case "turn":
          this.editorVisual.Players[player].turn[0].push({title: 'Return', class: 'visualR', id: id, inputs: [input.substring(input.indexOf("n") + 1),"","","","","","",""], pos: 0, true: 0, false: 0})
          break
        case "endGame":
          this.editorVisual.Endgame.push({title: 'Return', class: 'visualR', id: id, inputs: [input.substring(input.indexOf("n") + 1),"","","","","","",""], pos: 0, true: 0, false: 0})
          break
        case "effect":
          this.editorVisual.Cards[card].effect.push({title: 'Return', class: 'visualR', id: id, inputs: [input.substring(input.indexOf("n") + 1),"","","","","","",""], pos: 0, true: 0, false: 0})
          break
      } 
     
    }
  }


  
  updateVDSL()
  {
    this.editorVisual.clear()
    const lines = this.codeEditor.getValue().split(/\r?\n/)
    let method = ""
    let openAttribute = 0
    let openPlayer = 0
    let openCard = 0
    let openEndGame = 0
    let openState = 0
    let openAction = 0
    let openCondition = 0
    let openTurn = 0
    let openEffect = 0
    let openIfPlayer = 0
    let openIfEndGame = 0
    let playerCodeArea = 0
    let openIfCard = 0
    let openInitial = 0
    let inElse = false
    let inElseValue = 0
    let totalIfPlayer = 0
    let totalIfCard = 0
    let totalIfEndGame = 0
    const ifContains = [
      {numberOfIf: 0, open: 0}
    ]
    let createdIf = false
    let createdFor = false
    let doCreated = -1
    let doValue = 0
    let player = -1
    let card = -1
    let action = 0
    let open = 0
    let parent = ""
    for(let j = 0; j < lines.length; j++)
    {
      if((lines[j].includes("tileAttribute") && lines[j].includes("{")) || (lines[j].includes("tileAttribute") && lines[j + 1].includes("{")))
      {
        open++
        method = "tileAttribute"
        openAttribute = open
      } 
      else if((lines[j].includes("state") && lines[j].includes("{")) || (lines[j].includes("state") && lines[j + 1].includes("{")))
      {
        open++
        method = "state"
        openState = open
      }
      else if((lines[j].includes("player") && lines[j].includes("{")) || (lines[j].includes("player") && lines[j + 1].includes("{")))
      {
        open++
        method = "player"
        openPlayer = open
        player++
        action = 0
        parent = "player"
        if(this.editorVisual.Players[player] == null)
        {
          this.editorVisual.Players.push( {name: "", actionNames: [""], actionParams: [""], turnParams: [""], conditionParams: [""], actions: [[{title: '', class: '' , id: '', inputs: ["","","","","","","",""], pos: 0, true: 0, false: 0}]], conditions: [[{title: '', class: '' , id: '', inputs: ["","","","","","","",""], pos: 0, true: 0, false: 0}]], turn: [[{title: '', class: '' , id: '', inputs: ["","","","","","","",""], pos: 0, true: 0, false: 0}]], playerCode: [[{title: '', class: '' , id: '', inputs: ["","","","","","","",""], pos: 0, true: 0, false: 0}]]})
        }
        const l = lines[j].split(/\s+/)
        this.editorVisual.Players[player].name = l[1].replace(/{/g, "")
      }
      else if((lines[j].includes("card") && lines[j].includes("{")) || (lines[j].includes("card") && lines[j + 1].includes("{") && !lines[j].includes("this.")))
      {
        open++
        method = "card"
        parent = "card"
        openCard = open
        card++
        if(this.editorVisual.Cards[card] == null)
        {
          this.editorVisual.Cards.push({name: "", parameter: "",effect: [{title: '', class: '' , id: '', inputs: ["","","","","","","",""], pos: 0, true: 0, false: 0}], condition: [{title: '', class: '' , id: '', inputs: ["","","","","","","",""], pos: 0, true: 0, false: 0}]})
        }
        const l = lines[j].replace(/\s+/,"")
        this.editorVisual.Cards[card].name = l.substring(l.indexOf("d") + 1, l.indexOf("("))
        this.editorVisual.Cards[card].parameter = l.substring(l.indexOf("(") + 1, l.indexOf(")"))
        this.editorVisual.Variables.push({name: this.editorVisual.Cards[card].parameter, value: ""})
        this.editorVisual.listProperties.forEach((element) => {
          this.editorVisual.Variables.push({name:  this.editorVisual.Cards[card].parameter + "." + element, value: ""})
        })
        
      }
      else if((lines[j].includes("endgame") && lines[j].includes("{")) || (lines[j].includes("endgame") && lines[j + 1].includes("{")))
      {
        open++
        method = "endGame"
        parent = "endGame"
        openEndGame = open
      }
      else if((lines[j].includes("action") && lines[j].includes("{")) || (lines[j].includes("action") && lines[j + 1].includes("{")))
      {
        open++
        method = "action"
        openAction = open
        playerCodeArea = 0
        const l = lines[j].replace(/\s+/,"")
        if(this.editorVisual.Players[player].actions[action] == null)
        {
          this.editorVisual.Players[player].actions.push([{title: '', class: '' , id: '', inputs: ["","","","","","","",""], pos: 0, true: 0, false: 0}])
          this.editorVisual.Players[player].conditions.push([{title: '', class: '' , id: '', inputs: ["","","","","","","",""], pos: 0, true: 0, false: 0}])
        }
        this.editorVisual.Players[player].actionNames[action] = l.substring(l.indexOf("n") + 1, l.indexOf("("))
        this.editorVisual.Players[player].actionParams[action] = l.substring(l.indexOf("(") + 1, l.indexOf(")"))
        if(this.editorVisual.Players[player].actionParams[action][0] != null)
        {
          this.editorVisual.Variables.push({name: this.editorVisual.Players[player].actionParams[action][0], value: ""})
          this.editorVisual.listProperties.forEach((element) => {
            this.editorVisual.Variables.push({name:  this.editorVisual.Players[player].actionParams[action][0] + "." + element, value: ""})
          })
        }
        
      }
      else if((lines[j].includes("condition") && lines[j].includes("{")) || (lines[j].includes("condition") && lines[j + 1].includes("{")))
      {
        open++
        method = "condition"
        openCondition = open
        playerCodeArea = 0
        const l = lines[j].replace(/\s+/,"")
        switch(parent)
        {
          case "player":
            this.editorVisual.Players[player].conditionParams[action] = l.substring(l.indexOf("(") + 1, l.indexOf(")"))
            if(this.editorVisual.Players[player].conditionParams[action] != null)
            {
              this.editorVisual.Variables.push({name: this.editorVisual.Players[player].conditionParams[action], value: ""})
              this.editorVisual.listProperties.forEach((element) => {
                this.editorVisual.Variables.push({name:  this.editorVisual.Players[player].conditionParams[action] + "." + element, value: ""})
              })
            }
            break
        }
      }
      else if((lines[j].includes("turn") && lines[j].includes("{")) || (lines[j].includes("turn") && lines[j + 1].includes("{")))
      {
        open++
        method = "turn"
        openTurn = open
        playerCodeArea = 0
      }
      else if((lines[j].includes("effect") && lines[j].includes("{")) || (lines[j].includes("effect") && lines[j + 1].includes("{")))
      {
        open++
        method = "effect"
        openEffect = open
      }
      else if((lines[j].includes("if") && lines[j].includes("{")) || (lines[j].includes("if") && lines[j + 1].includes("{")))
      {
        switch(parent)
        {
          case "player":
            if(openIfPlayer == 0)
            {
              openInitial = 0
            }
            if(doCreated != openIfPlayer + 1)
            {
              open++
              openIfPlayer++
              if(totalIfPlayer == 0)
              {
                totalIfPlayer++
              }
              else if(createdFor)
              {
                totalIfPlayer++
              }
              else
              {
                totalIfPlayer = totalIfPlayer + 2
              }
              ifContains.push({numberOfIf: totalIfPlayer, open: openIfPlayer})
              createdIf = true
              inElse = false
            }
            break
          case "card":
            if(openIfCard == 0)
            {
              openInitial = 0
            }
            if(doCreated != openIfCard + 1)
            {
              open++
              openIfCard++
              if(totalIfCard == 0)
              {
                totalIfCard++
              }
              else if(createdFor)
              {
                totalIfCard++
              }
              else
              {
                totalIfCard = totalIfCard + 2
              }
              ifContains.push({numberOfIf: totalIfCard, open: openIfCard})
              createdIf = true
              inElse = false
            }
            break
          case "endGame":
            if(openIfEndGame == 0)
            {
              openInitial = 0
            }
            if(doCreated != openIfEndGame + 1)
            {
              open++
              openIfEndGame++
              if(totalIfEndGame == 0)
              {
                totalIfEndGame++
              }
              else if(createdFor)
              {
                totalIfEndGame++
              }
              else
              {
                totalIfEndGame = totalIfEndGame + 2
              }
              ifContains.push({numberOfIf: totalIfEndGame, open: openIfEndGame})
              createdIf = true
              inElse = false
            }
            break
        }
        
        
      }
      else if((lines[j].includes("else") && lines[j].includes("{")) || (lines[j].includes("else") && lines[j + 1].includes("{")))
      {
        open++
        switch(parent)
        {
          case "player":
            openIfPlayer++
            break
          case "card":
            openIfCard++
            break
          case "endGame":
            openIfEndGame++
            break
        }
        inElse = true
      }
      else if((lines[j].includes("for") && lines[j].includes("{")) || (lines[j].includes("for") && lines[j + 1].includes("{")))
      {
        switch(parent)
        {
          case "player":
            if(openIfPlayer == 0)
            {
              openInitial = 0
            }
            open++
            openIfPlayer++
            if(createdIf)
            {
              totalIfPlayer = totalIfPlayer + 2
            }
            else
            {
              totalIfPlayer++
            }
            createdFor = true
            ifContains.push({numberOfIf: totalIfPlayer, open: openIfPlayer})
            createdIf = false
            break
          case "card":
            if(openIfCard == 0)
            {
              openInitial = 0
            }
            open++
            openIfCard++
            if(createdIf)
            {
              totalIfCard = totalIfCard + 2
            }
            else
            {
              totalIfCard++
            }
            createdFor = true
            ifContains.push({numberOfIf: totalIfCard, open: openIfCard})
            createdIf = false
            break
          case "endGame":
            if(openIfEndGame == 0)
            {
              openInitial = 0
            }
            open++
            openIfEndGame++
            if(createdIf)
            {
              totalIfEndGame = totalIfEndGame + 2
            }
            else
            {
              totalIfEndGame++
            }
            createdFor = true
            ifContains.push({numberOfIf: totalIfEndGame, open: openIfEndGame})
            createdIf = false
            break
        }
        
      }
      else if((lines[j].includes("while") && lines[j].includes("{")) || (lines[j].includes("while") && lines[j + 1].includes("{")))
      {
        switch(parent)
        {
          case "player":
            if(openIfPlayer == 0)
            {
              openInitial = 0
            }
            if(doCreated != openIfPlayer + 1)
            {
              open++
              openIfPlayer++
              if(createdIf)
              {
                totalIfPlayer = totalIfPlayer + 2
              }
              else
              {
                totalIfPlayer++
              }
              createdFor = true
              ifContains.push({numberOfIf: totalIfPlayer, open: openIfPlayer})
              createdIf = false
            }
            break
          case "card":
            if(openIfCard == 0)
            {
              openInitial = 0
            }
            if(doCreated != openIfCard + 1)
            {
              open++
              openIfCard++
              if(createdIf)
              {
                totalIfCard = totalIfCard + 2
              }
              else
              {
                totalIfCard++
              }
              createdFor = true
              ifContains.push({numberOfIf: totalIfCard, open: openIfCard})
              createdIf = false
            }
            break
          case "endGame":
            if(openIfEndGame == 0)
            {
              openInitial = 0
            }
            if(doCreated != openIfEndGame + 1)
            {
              open++
              openIfEndGame++
              if(createdIf)
              {
                totalIfEndGame = totalIfEndGame + 2
              }
              else
              {
                totalIfEndGame++
              }
              createdFor = true
              ifContains.push({numberOfIf: totalIfEndGame, open: openIfEndGame})
              createdIf = false
            }
            break
        }
        
      }
      else if((lines[j].includes("do") && lines[j].includes("{")) || (lines[j].includes("do") && lines[j + 1].includes("{")))
      {
        switch(parent)
        {
          case "player":
            if(openIfPlayer == 0)
            {
              openInitial = 0
            }
            open++
            openIfPlayer++
            doCreated = openIfPlayer

            if(createdIf)
            {
              totalIfPlayer = totalIfPlayer + 2
            }
            else
            {
              totalIfPlayer++
            }
            createdFor = true
            ifContains.push({numberOfIf: totalIfPlayer, open: openIfPlayer})
            createdIf = false
            break
          case "card":
            if(openIfCard == 0)
            {
              openInitial = 0
            }
            open++
            openIfCard++
            doCreated = openIfCard

            if(createdIf)
            {
              totalIfCard = totalIfCard + 2
            }
            else
            {
              totalIfCard++
            }
            createdFor = true
            ifContains.push({numberOfIf: totalIfCard, open: openIfCard})
            createdIf = false
            break
          case "endGame":
            if(openIfEndGame == 0)
            {
              openInitial = 0
            }
            open++
            openIfEndGame++
            doCreated = openIfEndGame

            if(createdIf)
            {
              totalIfEndGame = totalIfEndGame + 2
            }
            else
            {
              totalIfEndGame++
            }
            createdFor = true
            ifContains.push({numberOfIf: totalIfEndGame, open: openIfEndGame})
            createdIf = false
            break
        }
        
      }
      else if(lines[j].includes("}"))
      {
        if(open === openState)
        {
          openState = 0
        }
        else if (open === openPlayer)
        {
          openPlayer = 0
        }
        else if (open === openAction)
        {
          openAction = 0
          playerCodeArea = 1
          method = "playerCodeArea"
        }
        else if (open === openCondition)
        {
          openCondition = 0
          if(parent == "player")
          {
            playerCodeArea = 1
            method = "playerCodeArea"
            action++
          }
        }
        else if (open === openTurn)
        {
          openTurn = 0
          playerCodeArea = 1
          method = "playerCodeArea"
        }
        else if (open === openCard)
        {
          openCard = 0
        }
        else if (open === openEndGame)
        {
          openEndGame = 0
        }
        else if (openIfPlayer > 0)
        {
          if(openIfPlayer != 0)
          {
            const place = ifContains.findIndex(obj => obj.open == openIfPlayer)
            if(place != -1)
            {
              if(doCreated == openIfPlayer)
              {
                doValue = ifContains[ifContains.length-2].numberOfIf
              }

              if(!lines[j + 1].includes("else") && !inElse && createdIf)
              {
                const index = ifContains[place].numberOfIf + 1
                this.editorVisual.PlayersLoops[index][0].inputs = ["","","","",""]
              }
              else if(!inElse && createdIf)
              {
                inElseValue = ifContains[ifContains.length-1].numberOfIf + 1
                ifContains.push({numberOfIf: ifContains[ifContains.length-1].numberOfIf + 1, open: openIfPlayer})
              }
              else if(inElse && ifContains[ifContains.length-1].numberOfIf == inElseValue)
              {
                inElse = false
              }
              ifContains.splice(place,1)
            }
            openIfPlayer--
          }
        }
        else if (openIfCard > 0)
        {
          if(openIfCard != 0)
          {
            const place = ifContains.findIndex(obj => obj.open == openIfCard)
            if(place != -1)
            {
              if(doCreated == openIfCard)
              {
                doValue = ifContains[ifContains.length-2].numberOfIf
              }

              if(!lines[j + 1].includes("else") && !inElse && createdIf)
              {
                const index = ifContains[place].numberOfIf + 1
                this.editorVisual.CardsLoop[index][0].inputs = ["","","","",""]
              }
              else if(!inElse && createdIf)
              {
                inElseValue = ifContains[ifContains.length-1].numberOfIf + 1
                ifContains.push({numberOfIf: ifContains[ifContains.length-1].numberOfIf + 1, open: openIfCard})
              }
              else if(inElse && ifContains[ifContains.length-1].numberOfIf == inElseValue)
              {
                inElse = false
              }
              ifContains.splice(place,1)
            }
            openIfCard--
          }
        }
        else if (openIfEndGame > 0)
        {
          if(openIfEndGame != 0)
          {
            const place = ifContains.findIndex(obj => obj.open == openIfEndGame)
            if(place != -1)
            {
              if(doCreated == openIfEndGame)
              {
                doValue = ifContains[ifContains.length-2].numberOfIf
              }

              if(!lines[j + 1].includes("else") && !inElse && createdIf)
              {
                const index = ifContains[place].numberOfIf + 1
                this.editorVisual.EndgameLoops[index][0].inputs = ["","","","",""]
              }
              else if(!inElse && createdIf)
              {
                inElseValue = ifContains[ifContains.length-1].numberOfIf + 1
                ifContains.push({numberOfIf: ifContains[ifContains.length-1].numberOfIf + 1, open: openIfEndGame})
              }
              else if(inElse && ifContains[ifContains.length-1].numberOfIf == inElseValue)
              {
                inElse = false
              }
              ifContains.splice(place,1)
            }
            openIfEndGame--
          }
        }
        open--
      }
      if(open == 0)
      {
        method = ""
        parent = ""
      }
      switch(method)
      {
        case "tileAttribute":
          if(!lines[j].includes("tileAttribute") && !lines[j].includes("{") && openAttribute != 0)
          {
            const l = lines[j].replace(/\s/g, '')
            const le = l.split(/=/)
            this.editorVisual.Properties.push({Property: le[0], Value: le[1]})
            this.editorVisual.listProperties.push(le[0])
          } 
          break
        case "state":
          if(!lines[j].includes("state") && !lines[j].includes("{") && openState != 0)
          {
            if(lines[j].includes("create"))
            {
              const num = lines[j].match(/(\d+)/)
              if(num != null)
              {
                for(let k = 0; k < +num[0]; k++)
                {
                  this.editorVisual.Tiles.push({values: new Array<string>(this.editorVisual.listProperties.length)})
                }
              }
            }
            else
            {
              const num = lines[j].match(/(\d+)/)
              const l = lines[j].replace(/\s/g, '')
              const le = l.split(/=/)
              const property = le[0].substring(le[0].indexOf(".") +1)
              this.editorVisual.listProperties.forEach((element, i) => {
                if(element == property)
                {
                  if(num != null)
                  this.editorVisual.Tiles[+num[0]].values[i] = le[1]
                }
              })
            }
          }
          break
        case "action":
            if(!lines[j].includes("action") && !lines[j].includes("{") && openAction != 0)
            {
              const l = lines[j].split(/\s+/)
              //Create
              if(l[1] == "let")
              {
                this.letCreation(l, openIfPlayer, player, action, ifContains[ifContains.length-1].numberOfIf, method, parent , card)
              } 
              //Set
              else if (this.editorVisual.Variables.find(vars => vars.name === l[1]) != null || l[1] !== "let" && l[2] == "=")
              {
                if(l[1] !== "let" && l[2] == "=")
                {
                  this.editorVisual.Variables.push({name: l[1], value: l[2]})
                  this.editorVisual.listProperties.forEach((element) => {
                    this.editorVisual.Variables.push({name:  l[1] + "." + element, value: ""})
                  })
                }
                this.setCreation(lines, j, l, openIfPlayer, ifContains[ifContains.length-1].numberOfIf, player, action, method, parent , card)
              }
              //Output
              else if (l[1].includes('output('))
              {
                this.ioCreation(lines, j, openIfPlayer, ifContains[ifContains.length-1].numberOfIf, player, action, method, "Output", "visualO", parent , card)
              }
              //Input
              else if(l[1].includes('input('))
              {
                this.ioCreation(lines, j, openIfPlayer, ifContains[ifContains.length-1].numberOfIf, player, action, method, "Input", "visualIn", parent , card)         
              }
              //Methods
              else if(this.editorVisual.methods.find(method => method.name === l[1].substring(0, l[1].indexOf("("))))
              {
                this.methodCreation(lines, j, l, openIfPlayer, ifContains[ifContains.length-1].numberOfIf, player, action, method, parent , card)
              }
              //If Statements
              else if(lines[j].includes("if(") || lines[j].includes("if ("))
              {
                const id = this.getEID()
                const params = this.getConditionParams(lines[j])
                this.ifCreation(parent)
                if(openIfPlayer > 0 && openInitial > 0)
                {
                  if(createdFor)
                  {
                    this.editorVisual.PlayersLoops[ifContains[ifContains.length-2].numberOfIf].push({title: 'If', class: 'visualIf', id: id, inputs: params, pos: 0,  true: this.editorVisual.playersLoopIndex-1, false: this.editorVisual.playersLoopIndex})
                    createdFor = false
                  }
                  else
                  {
                    this.editorVisual.PlayersLoops[ifContains[ifContains.length-2].numberOfIf].push({title: 'If', class: 'visualIf', id: id, inputs: params, pos: 0,  true: this.editorVisual.playersLoopIndex-1, false: this.editorVisual.playersLoopIndex})
                  }
                  
                }
                else
                {
                  openInitial++
                  this.editorVisual.Players[player].actions[action].push({title: 'If', class: 'visualIf', id: id, inputs: params, pos: 0,  true: this.editorVisual.playersLoopIndex-1, false: this.editorVisual.playersLoopIndex})
                  createdFor = false
                }
                
              }
              //Return statements
              else if(lines[j].includes("return"))
              {
                this.returnCreation(lines, j, openIfPlayer,  ifContains[ifContains.length-1].numberOfIf, player, action, method, parent , card)
              }
              //For Loops
              else if(lines[j].includes("for(") || lines[j].includes("for ("))
              {
                const id = this.getEID()
                const loop = lines[j].split(";")
                const num = loop[1].replace(/\D/g, '')
                let n = +num
                if(!loop[1].includes("="))
                {
                  n--
                }
                let by = 0
                if(loop[2].includes("++"))
                {
                  by = 1
                }
                else
                {
                  by = +loop[1].replace(/\D/g, '')
                }
                this.editorVisual.playersLoopIndex++
                if(openIfPlayer > 0 && openInitial > 0) 
                {
                  this.editorVisual.PlayersLoops[ifContains[ifContains.length-2].numberOfIf].push({title: 'For', class: 'visualF', id: id, inputs: [loop[0].substring(loop[0].length-1),n.toString(),by.toString(),"","","","",""], pos: this.editorVisual.playersLoopIndex,  true: 0, false: 0})
                }
                else
                {
                  openInitial++
                  this.editorVisual.Players[player].actions[action].push({title: 'For', class: 'visualF', id: id, inputs: [loop[0].substring(loop[0].length-1),n.toString(),by.toString(),"","","","",""], pos: this.editorVisual.playersLoopIndex,  true: 0, false: 0})
                }    
                this.loopCreation(parent)
              }
              //Do
              else if(lines[j].includes("do{") || lines[j].includes("do"))
              {
                const id = this.getEID()
                this.editorVisual.playersLoopIndex++
                if(openIfPlayer > 0 && openInitial > 0) 
                { 
                  this.editorVisual.PlayersLoops[ifContains[ifContains.length-2].numberOfIf].push({title: 'doWhile', class: 'visualD', id: id, inputs: ["","","","","","","",""], pos: this.editorVisual.playersLoopIndex,  true: 0, false: 0})
                }
                else
                {
                  openInitial++
                  this.editorVisual.Players[player].actions[action].push({title: 'doWhile', class: 'visualD', id: id, inputs: ["","","","","","","",""], pos: this.editorVisual.playersLoopIndex,  true: 0, false: 0})
                }    
                this.loopCreation(parent)
              }
              //While/do While Loops
              else if(lines[j].includes("while(") || lines[j].includes("while ("))
              {
                const id = this.getEID()
                const params = this.getConditionParams(lines[j])
                if(doCreated == openIfPlayer + 1)
                {
                  if(openIfPlayer > 0 && openInitial > 0) 
                  {
                    this.editorVisual.PlayersLoops[doValue][this.editorVisual.PlayersLoops[doValue].length - 1].inputs = params
                    doValue = 0
                  }
                  else
                  {
                    openInitial++
                    this.editorVisual.Players[player].actions[action][this.editorVisual.Players[player].actions[action].length-1].inputs = params
                  }
                  doCreated = -1    
                }
                else
                {
                  this.editorVisual.playersLoopIndex++
                  if(openIfPlayer > 0 && openInitial > 0) 
                  {
                    this.editorVisual.PlayersLoops[ifContains[ifContains.length-2].numberOfIf].push({title: 'While', class: 'visualW', id: id, inputs: params, pos: this.editorVisual.playersLoopIndex,  true: 0, false: 0})
                  }
                  else
                  {
                    openInitial++
                    this.editorVisual.Players[player].actions[action].push({title: 'While', class: 'visualW', id: id, inputs: params, pos: this.editorVisual.playersLoopIndex,  true: 0, false: 0})
                  }    
                  this.loopCreation(parent)
                }
              }
            }
          break
        case "condition":
            if(!lines[j].includes("condition") && !lines[j].includes("{") && openCondition != 0)
            {
              const l = lines[j].split(/\s+/)
              //Create
              if(l[1] == "let")
              {
                switch(parent)
                {
                  case "player":
                    this.letCreation(l, openIfPlayer, player, action, ifContains[ifContains.length-1].numberOfIf, method, parent , card)
                    break
                  case "card":
                    this.letCreation(l, openIfCard, player, action, ifContains[ifContains.length-1].numberOfIf, method, parent , card)
                    break
                } 
              } 
              //Set
              else if (this.editorVisual.Variables.find(vars => vars.name === l[1]) != null || l[1] !== "let" && l[2] == "=")
              {
                if(l[1] !== "let" && l[2] == "=")
                {
                  this.editorVisual.Variables.push({name: l[1], value: l[2]})
                  this.editorVisual.listProperties.forEach((element) => {
                    this.editorVisual.Variables.push({name:  l[1] + "." + element, value: ""})
                  })
                }
                switch(parent)
                {
                  case "player":
                    this.setCreation(lines, j, l, openIfPlayer, ifContains[ifContains.length-1].numberOfIf, player, action, method, parent , card)
                    break
                  case "card":
                    this.setCreation(lines, j, l, openIfCard, ifContains[ifContains.length-1].numberOfIf, player, action, method, parent , card)
                    break
                }
              }
              //Output
              else if (l[1].includes('output('))
              {
                switch(parent)
                {
                  case "player":
                    this.ioCreation(lines, j, openIfPlayer, ifContains[ifContains.length-1].numberOfIf, player, action, method, "Output", "visualO", parent , card)
                    break
                  case "card":
                    this.ioCreation(lines, j, openIfCard, ifContains[ifContains.length-1].numberOfIf, player, action, method, "Output", "visualO", parent , card)
                    break
                }
              }
              //Input
              else if(l[1].includes('input('))
              {
                switch(parent)
                {
                  case "player":
                    this.ioCreation(lines, j, openIfPlayer, ifContains[ifContains.length-1].numberOfIf, player, action, method, "Input", "visualIn", parent , card)         
                    break
                  case "card":
                    this.ioCreation(lines, j, openIfCard, ifContains[ifContains.length-1].numberOfIf, player, action, method, "Input", "visualIn", parent , card)         
                    break
                }
              }
              //Methods
              else if(this.editorVisual.methods.find(method => method.name === l[1].substring(0, l[1].indexOf("("))))
              {
                switch(parent)
                {
                  case "player":
                    this.methodCreation(lines, j, l, openIfPlayer, ifContains[ifContains.length-1].numberOfIf, player, action, method, parent , card)
                    break
                  case "card":
                    this.methodCreation(lines, j, l, openIfCard, ifContains[ifContains.length-1].numberOfIf, player, action, method, parent , card)
                    break
                }
              }
              //If Statements
              else if(lines[j].includes("if(") || lines[j].includes("if ("))
              {
                const id = this.getEID()
                const params = this.getConditionParams(lines[j])
                this.ifCreation(parent)
                switch(parent)
                {
                  case "player":
                    if(openIfPlayer > 0 && openInitial > 0)
                    {
                      if(createdFor)
                      {
                        this.editorVisual.PlayersLoops[ifContains[ifContains.length-2].numberOfIf].push({title: 'If', class: 'visualIf', id: id, inputs: params, pos: 0,  true: this.editorVisual.playersLoopIndex-1, false: this.editorVisual.playersLoopIndex})
                        createdFor = false
                      }
                      else
                      {
                        this.editorVisual.PlayersLoops[ifContains[ifContains.length-2].numberOfIf].push({title: 'If', class: 'visualIf', id: id, inputs: params, pos: 0,  true: this.editorVisual.playersLoopIndex-1, false: this.editorVisual.playersLoopIndex})
                      }
                    }
                    else
                    {
                      openInitial++
                      this.editorVisual.Players[player].conditions[action].push({title: 'If', class: 'visualIf', id: id, inputs: params, pos: 0,  true: this.editorVisual.playersLoopIndex-1, false: this.editorVisual.playersLoopIndex}) 
                      createdFor = false
                    }
                    break
                  case "card":
                    if(openIfCard > 0 && openInitial > 0)
                    {
                      if(createdFor)
                      {
                        this.editorVisual.CardsLoop[ifContains[ifContains.length-2].numberOfIf].push({title: 'If', class: 'visualIf', id: id, inputs: params, pos: 0,  true: this.editorVisual.cardsLoopIndex-1, false: this.editorVisual.cardsLoopIndex})
                        createdFor = false
                      }
                      else
                      {
                        this.editorVisual.CardsLoop[ifContains[ifContains.length-2].numberOfIf].push({title: 'If', class: 'visualIf', id: id, inputs: params, pos: 0,  true: this.editorVisual.cardsLoopIndex-1, false: this.editorVisual.cardsLoopIndex})
                      }
                    }
                    else
                    {
                      openInitial++
                      this.editorVisual.Cards[card].condition.push({title: 'If', class: 'visualIf', id: id, inputs: params, pos: 0,  true: this.editorVisual.cardsLoopIndex-1, false: this.editorVisual.cardsLoopIndex})
                      createdFor = false
                    }
                    break
                }
                
                
              }
              //Return statements
              else if(lines[j].includes("return"))
              {
                switch(parent)
                {
                  case "player":
                    this.returnCreation(lines, j, openIfPlayer,  ifContains[ifContains.length-1].numberOfIf, player, action, method, parent , card)
                    break
                  case "card":
                    this.returnCreation(lines, j, openIfCard,  ifContains[ifContains.length-1].numberOfIf, player, action, method, parent , card)
                    break
                }
              }
              //For Loops
              else if(lines[j].includes("for(") || lines[j].includes("for ("))
              {
                const id = this.getEID()
                const loop = lines[j].split(";")
                const num = loop[1].replace(/\D/g, '')
                let n = +num
                if(!loop[1].includes("="))
                {
                  n--
                }
                let by = 0
                if(loop[2].includes("++"))
                {
                  by = 1
                }
                else
                {
                  by = +loop[1].replace(/\D/g, '')
                }
                switch(parent)
                {
                  case "player":
                    this.editorVisual.playersLoopIndex++
                    if(openIfPlayer > 0 && openInitial > 0) 
                    {
                      this.editorVisual.PlayersLoops[ifContains[ifContains.length-2].numberOfIf].push({title: 'For', class: 'visualF', id: id, inputs: [loop[0].substring(loop[0].length-1),n.toString(),by.toString(),"","","","",""], pos: this.editorVisual.playersLoopIndex,  true: 0, false: 0})
                    }
                    else
                    {
                      openInitial++
                      this.editorVisual.Players[player].conditions[action].push({title: 'For', class: 'visualF', id: id, inputs: [loop[0].substring(loop[0].length-1),n.toString(),by.toString(),"","","","",""], pos: this.editorVisual.playersLoopIndex,  true: 0, false: 0})
                    }    
                    this.loopCreation(parent)
                    break
                  case "card":
                    this.editorVisual.cardsLoopIndex++
                    if(openIfCard > 0 && openInitial > 0) 
                    {
                      this.editorVisual.CardsLoop[ifContains[ifContains.length-2].numberOfIf].push({title: 'For', class: 'visualF', id: id, inputs: [loop[0].substring(loop[0].length-1),n.toString(),by.toString(),"","","","",""], pos: this.editorVisual.cardsLoopIndex,  true: 0, false: 0})
                    }
                    else
                    {
                      openInitial++
                      this.editorVisual.Cards[card].condition.push({title: 'For', class: 'visualF', id: id, inputs: [loop[0].substring(loop[0].length-1),n.toString(),by.toString(),"","","","",""], pos: this.editorVisual.cardsLoopIndex,  true: 0, false: 0})
                    }    
                    this.loopCreation(parent)
                    break
                }
                
              }
              //Do
              else if(lines[j].includes("do{") || lines[j].includes("do"))
              {
                const id = this.getEID()
                switch(parent)
                {
                  case "player":
                    this.editorVisual.playersLoopIndex++
                    if(openIfPlayer > 0 && openInitial > 0) 
                    { 
                      this.editorVisual.PlayersLoops[ifContains[ifContains.length-2].numberOfIf].push({title: 'doWhile', class: 'visualD', id: id, inputs: ["","","","","","","",""], pos: this.editorVisual.playersLoopIndex,  true: 0, false: 0})  
                    }
                    else
                    {
                      openInitial++
                      this.editorVisual.Players[player].conditions[action].push({title: 'doWhile', class: 'visualD', id: id, inputs: ["","","","","","","",""], pos: this.editorVisual.playersLoopIndex,  true: 0, false: 0})
                    }    
                    this.loopCreation(parent)
                    break
                  case "card":
                    this.editorVisual.cardsLoopIndex++
                    if(openIfCard > 0 && openInitial > 0) 
                    { 
                      this.editorVisual.CardsLoop[ifContains[ifContains.length-2].numberOfIf].push({title: 'doWhile', class: 'visualD', id: id, inputs: ["","","","","","","",""], pos: this.editorVisual.cardsLoopIndex,  true: 0, false: 0})
                    }
                    else
                    {
                      openInitial++
                      this.editorVisual.Cards[card].condition.push({title: 'doWhile', class: 'visualD', id: id, inputs: ["","","","","","","",""], pos: this.editorVisual.cardsLoopIndex,  true: 0, false: 0})
                    }    
                    this.loopCreation(parent)
                    break
                }
                
              }
              //While/do While Loops
              else if(lines[j].includes("while(") || lines[j].includes("while ("))
              {
                const id = this.getEID()
                const params = this.getConditionParams(lines[j])
                switch(parent)
                {
                  case "player":
                    if(doCreated == openIfPlayer + 1)
                    {
                      if(openIfPlayer > 0 && openInitial > 0) 
                      {
                        this.editorVisual.PlayersLoops[doValue][this.editorVisual.PlayersLoops[doValue].length - 1].inputs = params
                        doValue = 0
                      }
                      else
                      {
                        openInitial++
                        this.editorVisual.Players[player].conditions[action][this.editorVisual.Players[player].conditions[action].length-1].inputs = params
                      }
                      doCreated = -1    
                    }
                    else
                    {
                      this.editorVisual.playersLoopIndex++
                      if(openIfPlayer > 0 && openInitial > 0) 
                      {
                        this.editorVisual.PlayersLoops[ifContains[ifContains.length-2].numberOfIf].push({title: 'While', class: 'visualW', id: id, inputs: params, pos: this.editorVisual.playersLoopIndex,  true: 0, false: 0})
                      }
                      else
                      {
                        openInitial++
                        this.editorVisual.Players[player].conditions[action].push({title: 'While', class: 'visualW', id: id, inputs: params, pos: this.editorVisual.playersLoopIndex,  true: 0, false: 0})
                      }    
                      this.loopCreation(parent)
                    }
                    break
                  case "card":
                    if(doCreated == openIfCard + 1)
                    {
                      if(openIfCard > 0 && openInitial > 0) 
                      {
                        this.editorVisual.CardsLoop[doValue][this.editorVisual.CardsLoop[doValue].length - 1].inputs = params
                        doValue = 0
                      }
                      else
                      {
                        openInitial++
                        this.editorVisual.Cards[card].condition[this.editorVisual.Cards[card].condition.length-1].inputs = params
                      }
                      doCreated = -1    
                    }
                    else
                    {
                      this.editorVisual.cardsLoopIndex++
                      if(openIfCard > 0 && openInitial > 0) 
                      {
                        this.editorVisual.CardsLoop[ifContains[ifContains.length-2].numberOfIf].push({title: 'While', class: 'visualW', id: id, inputs: params, pos: this.editorVisual.cardsLoopIndex,  true: 0, false: 0})
                      }
                      else
                      {
                        openInitial++
                        this.editorVisual.Cards[card].condition.push({title: 'While', class: 'visualW', id: id, inputs: params, pos: this.editorVisual.cardsLoopIndex,  true: 0, false: 0})
                      }    
                      this.loopCreation(parent)
                    }
                    break
                  }
              }
            }
          break
        case "turn":
          if(!lines[j].includes("turn") && !lines[j].includes("{") && openTurn != 0)
          {
            const l = lines[j].split(/\s+/)
            //Create
            if(l[1] == "let")
            {
              this.letCreation(l, openIfPlayer, player, action, ifContains[ifContains.length-1].numberOfIf, method, parent , card)
            } 
            //Set
            else if (this.editorVisual.Variables.find(vars => vars.name === l[1]) != null || l[1] !== "let" && l[2] == "=")
            {
              if(l[1] !== "let" && l[2] == "=")
              {
                this.editorVisual.Variables.push({name: l[1], value: l[2]})
                this.editorVisual.listProperties.forEach((element) => {
                  this.editorVisual.Variables.push({name:  l[1] + "." + element, value: ""})
                })
              }
              this.setCreation(lines, j, l, openIfPlayer, ifContains[ifContains.length-1].numberOfIf, player, action, method, parent , card)
            }
            //Output
            else if (l[1].includes('output('))
            {
              this.ioCreation(lines, j, openIfPlayer, ifContains[ifContains.length-1].numberOfIf, player, action, method, "Output", "visualO", parent , card)
            }
            //Input
            else if(l[1].includes('input('))
            {
              this.ioCreation(lines, j, openIfPlayer, ifContains[ifContains.length-1].numberOfIf, player, action, method, "Input", "visualIn", parent , card)         
            }
            //Methods
            else if(this.editorVisual.methods.find(method => method.name === l[1].substring(0, l[1].indexOf("("))))
            {
              this.methodCreation(lines, j, l, openIfPlayer, ifContains[ifContains.length-1].numberOfIf, player, action, method, parent , card)
            }
            //If Statements
            else if(lines[j].includes("if(") || lines[j].includes("if ("))
            {
              const id = this.getEID()
              const params = this.getConditionParams(lines[j])
              this.ifCreation(parent)
              if(openIfPlayer > 0 && openInitial > 0)
              {
                if(createdFor)
                {
                  this.editorVisual.PlayersLoops[ifContains[ifContains.length-2].numberOfIf].push({title: 'If', class: 'visualIf', id: id, inputs: params, pos: 0,  true: this.editorVisual.playersLoopIndex-1, false: this.editorVisual.playersLoopIndex})
                  createdFor = false
                }
                else
                {
                  this.editorVisual.PlayersLoops[ifContains[ifContains.length-2].numberOfIf].push({title: 'If', class: 'visualIf', id: id, inputs: params, pos: 0,  true: this.editorVisual.playersLoopIndex-1, false: this.editorVisual.playersLoopIndex})
                }
                
              }
              else
              {
                openInitial++
                this.editorVisual.Players[player].turn[0].push({title: 'If', class: 'visualIf', id: id, inputs: params, pos: 0,  true: this.editorVisual.playersLoopIndex-1, false: this.editorVisual.playersLoopIndex})
                createdFor = false
              }
              
            }
            //Return statements
            else if(lines[j].includes("return"))
            {
              this.returnCreation(lines, j, openIfPlayer,  ifContains[ifContains.length-1].numberOfIf, player, action, method, parent , card)
            }
            //For Loops
            else if(lines[j].includes("for(") || lines[j].includes("for ("))
            {
              const id = this.getEID()
              const loop = lines[j].split(";")
              const num = loop[1].replace(/\D/g, '')
              let n = +num
              if(!loop[1].includes("="))
              {
                n--
              }
              let by = 0
              if(loop[2].includes("++"))
              {
                by = 1
              }
              else
              {
                by = +loop[1].replace(/\D/g, '')
              }
              this.editorVisual.playersLoopIndex++
              if(openIfPlayer > 0 && openInitial > 0) 
              {
                this.editorVisual.PlayersLoops[ifContains[ifContains.length-2].numberOfIf].push({title: 'For', class: 'visualF', id: id, inputs: [loop[0].substring(loop[0].length-1),n.toString(),by.toString(),"","","","",""], pos: this.editorVisual.playersLoopIndex,  true: 0, false: 0})
              }
              else
              {
                openInitial++
                this.editorVisual.Players[player].turn[0].push({title: 'For', class: 'visualF', id: id, inputs: [loop[0].substring(loop[0].length-1),n.toString(),by.toString(),"","","","",""], pos: this.editorVisual.playersLoopIndex,  true: 0, false: 0})
              }    
              this.loopCreation(parent)
            }
            //Do
            else if(lines[j].includes("do{") || lines[j].includes("do"))
            {
              const id = this.getEID()
              this.editorVisual.playersLoopIndex++
              if(openIfPlayer > 0 && openInitial > 0) 
              { 
                this.editorVisual.PlayersLoops[ifContains[ifContains.length-2].numberOfIf].push({title: 'doWhile', class: 'visualD', id: id, inputs: ["","","","","","","",""], pos: this.editorVisual.playersLoopIndex,  true: 0, false: 0})
              }
              else
              {
                openInitial++
                this.editorVisual.Players[player].turn[0].push({title: 'doWhile', class: 'visualD', id: id, inputs: ["","","","","","","",""], pos: this.editorVisual.playersLoopIndex,  true: 0, false: 0})
              }    
              this.loopCreation(parent)
            }
            //While/do While Loops
            else if(lines[j].includes("while(") || lines[j].includes("while ("))
            {
              const id = this.getEID()
              const params = this.getConditionParams(lines[j])
              if(doCreated == openIfPlayer + 1)
              {
                if(openIfPlayer > 0 && openInitial > 0) 
                {
                  this.editorVisual.PlayersLoops[doValue][this.editorVisual.PlayersLoops[doValue].length - 1].inputs = params
                  doValue = 0
                }
                else
                {
                  openInitial++
                  this.editorVisual.Players[player].turn[0][this.editorVisual.Players[player].turn[0].length-1].inputs = params
                }
                doCreated = -1    
              }
              else
              {
                this.editorVisual.playersLoopIndex++
                if(openIfPlayer > 0 && openInitial > 0) 
                {
                  this.editorVisual.PlayersLoops[ifContains[ifContains.length-2].numberOfIf].push({title: 'While', class: 'visualW', id: id, inputs: params, pos: this.editorVisual.playersLoopIndex,  true: 0, false: 0})
                }
                else
                {
                  openInitial++
                  this.editorVisual.Players[player].turn[0].push({title: 'While', class: 'visualW', id: id, inputs: params, pos: this.editorVisual.playersLoopIndex,  true: 0, false: 0})
                }    
                this.loopCreation(parent)
              }
            }
          }
          break
        case "playerCodeArea":
          if(playerCodeArea != 0)
          {
            const l = lines[j].split(/\s+/)
            //Set
            if (this.editorVisual.Variables.find(vars => vars.name === l[1]) != null || l[1] !== "let" && l[2] == "=")
            {
              if(l[1] !== "let" && l[2] == "=")
              {
                this.editorVisual.Variables.push({name: l[1], value: l[2]})
                this.editorVisual.listProperties.forEach((element) => {
                  this.editorVisual.Variables.push({name:  l[1] + "." + element, value: ""})
                })
              }
              this.setCreation(lines, j, l, openIfPlayer, ifContains[ifContains.length-1].numberOfIf, player, action, method, parent , card)
            }
          }
          break
        case "effect":
          if(!lines[j].includes("effect") && !lines[j].includes("{") && openEffect != 0)
          {
            const l = lines[j].split(/\s+/)
            //Create
            if(l[1] == "let")
            {
              this.letCreation(l, openIfCard, player, action, ifContains[ifContains.length-1].numberOfIf, method, parent , card)
            } 
            //Set
            else if (this.editorVisual.Variables.find(vars => vars.name === l[1]) != null || l[1] !== "let" && l[2] == "=")
            {
              if(l[1] !== "let" && l[2] == "=")
              {
                this.editorVisual.Variables.push({name: l[1], value: l[2]})
                this.editorVisual.listProperties.forEach((element) => {
                  this.editorVisual.Variables.push({name:  l[1] + "." + element, value: ""})
                })
              }
              this.setCreation(lines, j, l, openIfCard, ifContains[ifContains.length-1].numberOfIf, player, action, method, parent , card)
            }
            //Output
            else if (l[1].includes('output('))
            {
              this.ioCreation(lines, j, openIfCard, ifContains[ifContains.length-1].numberOfIf, player, action, method, "Output", "visualO", parent , card)
            }
            //Input
            else if(l[1].includes('input('))
            {
              this.ioCreation(lines, j, openIfCard, ifContains[ifContains.length-1].numberOfIf, player, action, method, "Input", "visualIn", parent , card)         
            }
            //Methods
            else if(this.editorVisual.methods.find(method => method.name === l[1].substring(0, l[1].indexOf("("))))
            {
              this.methodCreation(lines, j, l, openIfCard, ifContains[ifContains.length-1].numberOfIf, player, action, method, parent , card)
            }
            //If Statements
            else if(lines[j].includes("if(") || lines[j].includes("if ("))
            {
              const id = this.getEID()
              const params = this.getConditionParams(lines[j])
              this.ifCreation(parent)
              if(openIfCard > 0 && openInitial > 0)
              {
                if(createdFor)
                {
                  this.editorVisual.CardsLoop[ifContains[ifContains.length-2].numberOfIf].push({title: 'If', class: 'visualIf', id: id, inputs: params, pos: 0,  true: this.editorVisual.cardsLoopIndex-1, false: this.editorVisual.playersLoopIndex})
                  createdFor = false
                }
                else
                {
                  this.editorVisual.CardsLoop[ifContains[ifContains.length-2].numberOfIf].push({title: 'If', class: 'visualIf', id: id, inputs: params, pos: 0,  true: this.editorVisual.cardsLoopIndex-1, false: this.editorVisual.playersLoopIndex})
                }
                
              }
              else
              {
                openInitial++
                this.editorVisual.Cards[card].effect.push({title: 'If', class: 'visualIf', id: id, inputs: params, pos: 0,  true: this.editorVisual.cardsLoopIndex-1, false: this.editorVisual.cardsLoopIndex})
                createdFor = false
              }
              
            }
            //Return statements
            else if(lines[j].includes("return"))
            {
              this.returnCreation(lines, j, openIfCard,  ifContains[ifContains.length-1].numberOfIf, player, action, method, parent , card)
            }
            //For Loops
            else if(lines[j].includes("for(") || lines[j].includes("for ("))
            {
              const id = this.getEID()
              const loop = lines[j].split(";")
              const num = loop[1].replace(/\D/g, '')
              let n = +num
              if(!loop[1].includes("="))
              {
                n--
              }
              let by = 0
              if(loop[2].includes("++"))
              {
                by = 1
              }
              else
              {
                by = +loop[1].replace(/\D/g, '')
              }
              this.editorVisual.cardsLoopIndex++
              if(openIfCard > 0 && openInitial > 0) 
              {
                this.editorVisual.CardsLoop[ifContains[ifContains.length-2].numberOfIf].push({title: 'For', class: 'visualF', id: id, inputs: [loop[0].substring(loop[0].length-1),n.toString(),by.toString(),"","","","",""], pos: this.editorVisual.cardsLoopIndex,  true: 0, false: 0})
              }
              else
              {
                openInitial++
                this.editorVisual.Cards[card].effect.push({title: 'For', class: 'visualF', id: id, inputs: [loop[0].substring(loop[0].length-1),n.toString(),by.toString(),"","","","",""], pos: this.editorVisual.cardsLoopIndex,  true: 0, false: 0})
              }    
              this.loopCreation(parent)
            }
            //Do
            else if(lines[j].includes("do{") || lines[j].includes("do"))
            {
              const id = this.getEID()
              this.editorVisual.cardsLoopIndex++
              if(openIfCard > 0 && openInitial > 0) 
              { 
                this.editorVisual.CardsLoop[ifContains[ifContains.length-2].numberOfIf].push({title: 'doWhile', class: 'visualD', id: id, inputs: ["","","","","","","",""], pos: this.editorVisual.cardsLoopIndex,  true: 0, false: 0})
              }
              else
              {
                openInitial++
                this.editorVisual.Cards[card].effect.push({title: 'doWhile', class: 'visualD', id: id, inputs: ["","","","","","","",""], pos: this.editorVisual.cardsLoopIndex,  true: 0, false: 0})
              }    
              this.loopCreation(parent)
            }
            //While/do While Loops
            else if(lines[j].includes("while(") || lines[j].includes("while ("))
            {
              const id = this.getEID()
              const params = this.getConditionParams(lines[j])
              if(doCreated == openIfCard + 1)
              {
                if(openIfCard > 0 && openInitial > 0) 
                {
                  this.editorVisual.CardsLoop[doValue][this.editorVisual.CardsLoop[doValue].length - 1].inputs = params
                  doValue = 0
                }
                else
                {
                  openInitial++
                  this.editorVisual.Cards[card].effect[this.editorVisual.Cards[card].effect.length-1].inputs = params
                }
                doCreated = -1    
              }
              else
              {
                this.editorVisual.cardsLoopIndex++
                if(openIfCard > 0 && openInitial > 0) 
                {
                  this.editorVisual.CardsLoop[ifContains[ifContains.length-2].numberOfIf].push({title: 'While', class: 'visualW', id: id, inputs: params, pos: this.editorVisual.cardsLoopIndex,  true: 0, false: 0})
                }
                else
                {
                  openInitial++
                  this.editorVisual.Cards[card].effect.push({title: 'While', class: 'visualW', id: id, inputs: params, pos: this.editorVisual.cardsLoopIndex,  true: 0, false: 0})
                }    
                this.loopCreation(parent)
              }
            }
          }
          break
        case "endGame":
          if(!lines[j].includes("endGame") && !lines[j].includes("{") && openEndGame != 0)
          {
            const l = lines[j].split(/\s+/)
            //Create
            if(l[1] == "let")
            {
              this.letCreation(l, openIfEndGame, player, action, ifContains[ifContains.length-1].numberOfIf, method, parent , card)
            } 
            //Set
            else if (this.editorVisual.Variables.find(vars => vars.name === l[1]) != null || l[1] !== "let" && l[2] == "=")
            {
              if(l[1] !== "let" && l[2] == "=")
              {
                this.editorVisual.Variables.push({name: l[1], value: l[2]})
                this.editorVisual.listProperties.forEach((element) => {
                  this.editorVisual.Variables.push({name:  l[1] + "." + element, value: ""})
                })
              }
              this.setCreation(lines, j, l, openIfEndGame, ifContains[ifContains.length-1].numberOfIf, player, action, method, parent , card)
            }
            //Output
            else if (l[1].includes('output('))
            {
              this.ioCreation(lines, j, openIfEndGame, ifContains[ifContains.length-1].numberOfIf, player, action, method, "Output", "visualO", parent , card)
            }
            //Input
            else if(l[1].includes('input('))
            {
              this.ioCreation(lines, j, openIfEndGame, ifContains[ifContains.length-1].numberOfIf, player, action, method, "Input", "visualIn", parent , card)         
            }
            //Methods
            else if(this.editorVisual.methods.find(method => method.name === l[1].substring(0, l[1].indexOf("("))))
            {
              this.methodCreation(lines, j, l, openIfEndGame, ifContains[ifContains.length-1].numberOfIf, player, action, method, parent , card)
            }
            //If Statements
            else if(lines[j].includes("if(") || lines[j].includes("if ("))
            {
              const id = this.getEID()
              const params = this.getConditionParams(lines[j])
              this.ifCreation(parent)
              if(openIfEndGame > 0 && openInitial > 0)
              {
                if(createdFor)
                {
                  this.editorVisual.EndgameLoops[ifContains[ifContains.length-2].numberOfIf].push({title: 'If', class: 'visualIf', id: id, inputs: params, pos: 0,  true: this.editorVisual.endLoopIndex-1, false: this.editorVisual.endLoopIndex})
                  createdFor = false
                }
                else
                {
                  this.editorVisual.EndgameLoops[ifContains[ifContains.length-2].numberOfIf].push({title: 'If', class: 'visualIf', id: id, inputs: params, pos: 0,  true: this.editorVisual.endLoopIndex-1, false: this.editorVisual.endLoopIndex})
                }
                
              }
              else
              {
                openInitial++
                this.editorVisual.Endgame.push({title: 'If', class: 'visualIf', id: id, inputs: params, pos: 0,  true: this.editorVisual.endLoopIndex-1, false: this.editorVisual.endLoopIndex})
                createdFor = false
              }
              
            }
            //Return statements
            else if(lines[j].includes("return"))
            {
              this.returnCreation(lines, j, openIfEndGame,  ifContains[ifContains.length-1].numberOfIf, player, action, method, parent , card)
            }
            //For Loops
            else if(lines[j].includes("for(") || lines[j].includes("for ("))
            {
              const id = this.getEID()
              const loop = lines[j].split(";")
              const num = loop[1].replace(/\D/g, '')
              let n = +num
              if(!loop[1].includes("="))
              {
                n--
              }
              let by = 0
              if(loop[2].includes("++"))
              {
                by = 1
              }
              else
              {
                by = +loop[1].replace(/\D/g, '')
              }
              this.editorVisual.endLoopIndex++
              if(openIfEndGame > 0 && openInitial > 0) 
              {
                this.editorVisual.EndgameLoops[ifContains[ifContains.length-2].numberOfIf].push({title: 'For', class: 'visualF', id: id, inputs: [loop[0].substring(loop[0].length-1),n.toString(),by.toString(),"","","","",""], pos: this.editorVisual.endLoopIndex,  true: 0, false: 0})
              }
              else
              {
                openInitial++
                this.editorVisual.Cards[card].effect.push({title: 'For', class: 'visualF', id: id, inputs: [loop[0].substring(loop[0].length-1),n.toString(),by.toString(),"","","","",""], pos: this.editorVisual.endLoopIndex,  true: 0, false: 0})
              }    
              this.loopCreation(parent)
            }
            //Do
            else if(lines[j].includes("do{") || lines[j].includes("do"))
            {
              const id = this.getEID()
              this.editorVisual.endLoopIndex++
              if(openIfEndGame > 0 && openInitial > 0) 
              { 
                this.editorVisual.EndgameLoops[ifContains[ifContains.length-2].numberOfIf].push({title: 'doWhile', class: 'visualD', id: id, inputs: ["","","","","","","",""], pos: this.editorVisual.endLoopIndex,  true: 0, false: 0})
              }
              else
              {
                openInitial++
                this.editorVisual.Endgame.push({title: 'doWhile', class: 'visualD', id: id, inputs: ["","","","","","","",""], pos: this.editorVisual.endLoopIndex,  true: 0, false: 0})
              }    
              this.loopCreation(parent)
            }
            //While/do While Loops
            else if(lines[j].includes("while(") || lines[j].includes("while ("))
            {
              const id = this.getEID()
              const params = this.getConditionParams(lines[j])
              if(doCreated == openIfEndGame + 1)
              {
                if(openIfEndGame > 0 && openInitial > 0) 
                {
                  this.editorVisual.EndgameLoops[doValue][this.editorVisual.EndgameLoops[doValue].length - 1].inputs = params
                  doValue = 0
                }
                else
                {
                  openInitial++
                  this.editorVisual.Endgame[this.editorVisual.Endgame.length-1].inputs = params
                }
                doCreated = -1    
              }
              else
              {
                this.editorVisual.endLoopIndex++
                if(openIfEndGame > 0 && openInitial > 0) 
                {
                  this.editorVisual.EndgameLoops[ifContains[ifContains.length-2].numberOfIf].push({title: 'While', class: 'visualW', id: id, inputs: params, pos: this.editorVisual.endLoopIndex,  true: 0, false: 0})
                }
                else
                {
                  openInitial++
                  this.editorVisual.Endgame.push({title: 'While', class: 'visualW', id: id, inputs: params, pos: this.editorVisual.endLoopIndex,  true: 0, false: 0})
                }    
                this.loopCreation(parent)
              }
            }
          }
          break
      }
    }
  }

}
