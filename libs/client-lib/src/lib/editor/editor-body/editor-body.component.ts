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
        next:(value)=>{
          if(value.status === "success"){
            //UpdateLineArray()
            //this.updateVDSL()
            this.changesTracker.emit(2);
            this.newProgramStructureEvent.emit(value.programStructure);
          }else{
            this.changesTracker.emit(0);
          }

          console.log(value)
          this.newMessageEvent.emit(value.message);
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

  updateVDSL()
  {
    this.editorVisual.clear()
    const lines = this.codeEditor.getValue().split(/\r?\n/)
    let method = ""
    let openPlayer = 0
    let openState = 0
    let openAction = 0
    let openCondition = 0
    let openTurn = 0
    let openIf = 0
    let openInitial = 0
    let inElse = false
    let totalIf = 0
    const ifContains = [
      {numberOfIf: 0, open: 0}
    ]
    let createdIf = false
    let createdFor = false
    let player = -1
    let action = 0
    let open = 0
    let d = 0
    for(let j = 0; j < lines.length; j++)
    {
      //console.log("line " + j + ":" + lines[j])
      if((lines[j].includes("state") && lines[j].includes("{")) || (lines[j].includes("state") && lines[j + 1].includes("{")))
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
        if(this.editorVisual.Players[player] == null)
        {
          this.editorVisual.Players.push({name: "", actionNames: [""], actionParams: [[""]], turnParams: [""], conditionParams: [""], actions: [[{title: '', class: '' , id: '', inputs: ["","","","","","","",""], pos: 0, true: 0, false: 0}]], conditions: [[{title: '', class: '' , id: '', inputs: ["","","","","","","",""], pos: 0, true: 0, false: 0}]], turn: [[{title: '', class: '' , id: '', inputs: ["","","","","","","",""], pos: 0, true: 0, false: 0}]]})
        }
        const l = lines[j].split(/\s+/)
        this.editorVisual.Players[player].name = l[1].replace(/{/g, "")
      }
      else if((lines[j].includes("action") && lines[j].includes("{")) || (lines[j].includes("action") && lines[j + 1].includes("{")))
      {
        open++
        method = "action"
        openAction = open
        const l = lines[j].split(/\s+/)
        this.editorVisual.Players[player].actionNames[action] = l[2].substring(0, l[2].indexOf("("))
        this.editorVisual.Players[player].actionParams[action][0] = l[2].substring(l[2].indexOf("(") + 1, l[2].indexOf(")"))
      }
      else if((lines[j].includes("condition") && lines[j].includes("{")) || (lines[j].includes("condition") && lines[j + 1].includes("{")))
      {
        open++
        method = "condtiion"
        openCondition = open
        const l = lines[j].split(/\s+/)
        this.editorVisual.Players[player].conditionParams[action] = l[1].substring(l[1].indexOf("(") + 1, l[1].indexOf(")"))
      }
      else if ((lines[j].includes("turn") && lines[j].includes("{")) || (lines[j].includes("turn") && lines[j + 1].includes("{")))
      {
        open++
        method = "turn"
        openTurn = open
      }
      else if((lines[j].includes("if") && lines[j].includes("{")) || (lines[j].includes("if") && lines[j + 1].includes("{")))
      {
        if(openIf == 0)
        {
          openInitial = 0
        }
        open++
        openIf++
        if(totalIf == 0)
        {
          totalIf++
        }
        else if(createdFor)
        {
          totalIf++
        }
        else
        {
          totalIf = totalIf + 2
        }
        ifContains.push({numberOfIf: totalIf, open: openIf})
        createdIf = true
        inElse = false
        
      }
      else if((lines[j].includes("else") && lines[j].includes("{")) || (lines[j].includes("else") && lines[j + 1].includes("{")))
      {
        open++
        openIf++
        inElse = true
      }
      else if((lines[j].includes("for") && lines[j].includes("{")) || (lines[j].includes("for") && lines[j + 1].includes("{")))
      {
        open++
        openIf++
        if(openIf == 0)
        {
          openInitial = 0
        }
        if(createdIf)
        {
          totalIf = totalIf + 2
        }
        else
        {
          totalIf++
        }
        createdFor = true
        ifContains.push({numberOfIf: totalIf, open: openIf})
        createdIf = false
      }
      else if((lines[j].includes("while") && lines[j].includes("{")) || (lines[j].includes("while") && lines[j + 1].includes("{")))
      {
        open++
       
      }
      else if((lines[j].includes("do") && lines[j].includes("{")) || (lines[j].includes("do") && lines[j + 1].includes("{")))
      {
        open++
        
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
        }
        else if (open === openCondition)
        {
          openCondition = 0
          action++
        }
        else if (open === openTurn)
        {
          openTurn = 0
        }
        else if (openIf > -1)
        {
          if(openIf != 0)
          {
            const place = ifContains.findIndex(obj => obj.open == openIf)
            if(place != -1)
            {
              if(!lines[j + 1].includes("else") && !inElse && createdIf)
              {
                const index = ifContains[place].numberOfIf + 1
                this.editorVisual.PlayersLoops[index][0].inputs = ["","","","",""]
              }
              else if(!inElse)
              {
                ifContains.push({numberOfIf: ifContains[ifContains.length-1].numberOfIf + 1, open: openIf})
              }
              else if(inElse)
              {
                inElse = false
              }
              ifContains.splice(place,1)   
            }
            openIf--
          }
        }
        open--
      }
      
      if(open == 0)
      {
        method = ""
      }

      switch(method)
      {
        case "state":
          if(!lines[j].includes("state") && !lines[j].includes("{") && openState != 0)
          {
            const l = lines[j].split(/\s+/)
            if(l[1].includes("create"))
            {
              const num = l[1].match(/(\d+)/)
              if(num != null)
              {
                for(let k = 0; k < +num[0]; k++)
                {
                  this.editorVisual.Tiles.push({variable: '', id: '', name: '', type: ''})
                }
              }
            }
            else if(l[1].includes("name"))
            {
              const num = l[1].match(/(\d+)/)
              if(num != null)
              {
                this.editorVisual.Tiles[+num[0]].name = l[3].replace(/'/g, "")
              }
            }
            else if(l[1].includes("type"))
            {
              const num = l[1].match(/(\d+)/)
              if(num != null)
              {
                this.editorVisual.Tiles[+num[0]].type = l[3].replace(/'/g, "")
              }
            }
            else if(l[1].includes("id"))
            {
              const num = l[1].match(/(\d+)/)
              if(num != null)
              {
                this.editorVisual.Tiles[+num[0]].id = l[3].replace(/'/g, "")
              }
            } 
          }
          break
        case "action":
          {
            if(!lines[j].includes("action") && !lines[j].includes("{") && openAction != 0)
            {
              const l = lines[j].split(/\s+/)
              //Create
              if(l[1] == "let")
              {
                
                const id = this.getEID()
                if(openIf > 0)
                {
                  this.editorVisual.PlayersLoops[ifContains[ifContains.length-1].numberOfIf].push({title: 'Create',  class: 'visualC', id: id, inputs: [l[2],l[4].replace(/'/g, ""),"","","","","",""], pos: 0, true: 0, false: 0})
                }
                else
                {
                  this.editorVisual.Players[player].actions[action].push({title: 'Create',  class: 'visualC', id: id, inputs: [l[2],l[4].replace(/'/g, ""),"","","","","",""], pos: 0, true: 0, false: 0})
                }
  
                this.editorVisual.Variables.push({name: l[2], value: l[4].replace(/'/g, "")})
              }
              //Set
              else if (this.editorVisual.Variables.find(vars => vars.name === l[1]) != null)
              {
                const id = this.getEID()
                const set = this.editorVisual.Variables.find(vars => vars.name === l[1])
                if(set != null)
                {
                  if(openIf > 0)
                  {
                    this.editorVisual.PlayersLoops[ifContains[ifContains.length-1].numberOfIf].push({title: 'Set',  class: 'visualS', id: id, inputs: [set?.name, lines[j].substring(lines[j].indexOf("=") + 1),"","","","","",""], pos: 0, true: 0, false: 0})
                  }
                  else
                  {
                    this.editorVisual.Players[player].actions[action].push({title: 'Set',  class: 'visualS', id: id, inputs: [set?.name, lines[j].substring(lines[j].indexOf("=") + 1),"","","","","",""], pos: 0, true: 0, false: 0})
                  }
                     
                }
                
              }
              //Output
              else if (l[1].includes('output('))
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
                  this.editorVisual.PlayersLoops[ifContains[ifContains.length-1].numberOfIf].push({title: 'Output', class: 'visualO', id: id, inputs: [input[0],"","","","","","",""], pos: 0, true: 0, false: 0})
                }
                else
                {
                  this.editorVisual.Players[player].actions[action].push({title: 'Output', class: 'visualO', id: id, inputs: [input[0],"","","","","","",""], pos: 0, true: 0, false: 0})
                } 
              }
              //Input
              else if(l[1].includes('input('))
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
                  this.editorVisual.PlayersLoops[ifContains[ifContains.length-1].numberOfIf].push({title: 'Input', class: 'visualIn', id: id, inputs: [input[0],"","","","","","",""], pos: 0, true: 0, false: 0})
                }
                else
                {
                  this.editorVisual.Players[player].actions[action].push({title: 'Input', class: 'visualIn', id: id, inputs: [input[0],"","","","","","",""], pos: 0, true: 0, false: 0})
                }
                                
              }
              //Methods
              else if(this.editorVisual.methods.find(method => method.name === l[1].substring(0, l[1].indexOf("("))))
              {
                const id = this.getEID()
                const call = this.editorVisual.methods.find(method => method.name === l[1].substring(0, l[1].indexOf("(")))
                if(call != null)
                {
                  if(call.arguments === 1)
                  {
                    if(openIf > 0)
                    {
                      this.editorVisual.PlayersLoops[ifContains[ifContains.length-1].numberOfIf].push({title: 'Call', class: 'visualM', id: id, inputs: [call.name, call.arguments.toString(), lines[j].substring(lines[j].indexOf("(") + 1, lines[j].length-1),"","","","",""], pos: 0, true: 0, false: 0})
                    }
                    else
                    {
                      this.editorVisual.Players[player].actions[action].push({title: 'Call', class: 'visualM', id: id, inputs: [call.name, call.arguments.toString(), lines[j].substring(lines[j].indexOf("(") + 1, lines[j].length-1),"","","","",""], pos: 0, true: 0, false: 0})
                    }
     
                  }
                  else
                  {
                    if(openIf > 0)
                    {
                      this.editorVisual.PlayersLoops[ifContains[ifContains.length-1].numberOfIf].push({title: 'Call', class: 'visualM', id: id, inputs: [call.name, call.arguments.toString(), lines[j].substring(lines[j].indexOf("(") + 1, lines[j].indexOf(",")), lines[j].substring(lines[j].indexOf(",") + 1, lines[j].length-1),"","","",""], pos: 0, true: 0, false: 0})
                    }
                    else
                    {
                      this.editorVisual.Players[player].actions[action].push({title: 'Call', class: 'visualM', id: id, inputs: [call.name, call.arguments.toString(), lines[j].substring(lines[j].indexOf("(") + 1, lines[j].indexOf(",")), lines[j].substring(lines[j].indexOf(",") + 1, lines[j].length-1),"","","",""], pos: 0, true: 0, false: 0})
                    }
                  }
                }
              }
              //If Statements
              else if(lines[j].includes("if(") || lines[j].includes("if ("))
              {
                const id = this.getEID()
                const params = []
                const conditions = (lines[j].match(/&&/g) || []).length + (lines[j].match(/\|\|/g) || []).length + 1
                const AndOr = lines[j].match(/&& | \|\|/g)
                let aoIndex = 0
                const condi = lines[j].substring(lines[j].indexOf("(") + 1, lines[j].indexOf(")")).replace(/\s/g, '').split(/[&&,||]/)
                params.push(conditions.toString())
                //console.log(lines[j].split("&&"))
                condi.forEach((line) => {
                  if(line.includes(">") && !line.includes("="))
                  {
                    params.push(line.substring(0,1))
                    params.push(">")
                    params.push(line.substring(line.length-1))
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
                    params.push(line.substring(0,1))
                    params.push("<")
                    params.push(line.substring(line.length-1))
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
                    params.push(line.substring(0,1))
                    params.push("==")
                    params.push(line.substring(line.length-1))
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
                    params.push(line.substring(0,1))
                    params.push("!=")
                    params.push(line.substring(line.length-1))
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
                    params.push(line.substring(0,1))
                    params.push(">=")
                    params.push(line.substring(line.length-1))
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
                    params.push(line.substring(0,1))
                    params.push("<=")
                    params.push(line.substring(line.length-1))
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
                this.editorVisual.playersLoopIndex++
                const dest = [
                  {title: '', class: '' , id: '', inputs: ["","","","","","","",""], pos: 0, true: 0, false: 0}
                ]
                this.editorVisual.PlayersLoops.push(dest)
                this.editorVisual.playersLoopIndex++
                const dest2 = [
                  {title: '', class: '' , id: '', inputs: ["","","","","","","",""], pos: 0, true: 0, false: 0}
                ]
                this.editorVisual.PlayersLoops.push(dest2)
                if(openIf > 0 && openInitial > 0)
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
                }
                
              }
              //Return statements
              else if(lines[j].includes("return"))
              {
                const id = this.getEID()
                const input = lines[j].split(' ').join('');
                if(openIf > 0)
                {
                  this.editorVisual.PlayersLoops[ifContains[ifContains.length-1].numberOfIf].push({title: 'Return', class: 'visualR', id: id, inputs: [input.substring(input.indexOf("n") + 1),"","","","","","",""], pos: 0, true: 0, false: 0})
                }
                else
                {
                  this.editorVisual.Players[player].actions[action].push({title: 'Return', class: 'visualR', id: id, inputs: [input.substring(input.indexOf("n") + 1),"","","","","","",""], pos: 0, true: 0, false: 0})
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
                this.editorVisual.playersLoopIndex++
                if(openIf > 0 && openInitial > 0) 
                {
                  this.editorVisual.PlayersLoops[ifContains[ifContains.length-2].numberOfIf].push({title: 'For', class: 'visualF', id: id, inputs: [loop[0].substring(loop[0].length-1),n.toString(),by.toString(),"","","","",""], pos: this.editorVisual.playersLoopIndex,  true: 0, false: 0})
                }
                else
                {
                  openInitial++
                  this.editorVisual.Players[player].actions[action].push({title: 'For', class: 'visualF', id: id, inputs: [loop[0].substring(loop[0].length-1),n.toString(),by.toString(),"","","","",""], pos: this.editorVisual.playersLoopIndex,  true: 0, false: 0})
                }    
                const dest = [
                  {title: '', class: '' , id: '', inputs: ["","","","","","","",""], pos: 0, true: 0, false: 0}
                ]
                this.editorVisual.PlayersLoops.push(dest)
              }
              //Do
              else if(lines[j].includes("do{") || lines[j].includes("do"))
              {
                d = 1
              }
              //While/do While Loops
              else if(lines[j].includes("while(") || lines[j].includes("while ("))
              {
                const id = this.getEID()
                let params = [""]
                let operator = ""
                if(lines[j].includes(">") && !lines[j].includes("="))
                {
                  params = lines[j].substring(lines[j].indexOf("(") + 1).split(">")
                  operator = ">"
                }
                else if(lines[j].includes("<") && !lines[j].includes("="))
                {
                  params = lines[j].substring(lines[j].indexOf("(") + 1).split("<")
                  operator = "<"
                }
                else if(lines[j].includes("=="))
                {
                  params = lines[j].substring(lines[j].indexOf("(") + 1).split("==")
                  operator = "=="
                }
                else if(lines[j].includes("!="))
                {
                  params = lines[j].substring(lines[j].indexOf("(") + 1).split("!=")
                  operator = "!="
                }
                else if(lines[j].includes(">="))
                {
                  params = lines[j].substring(lines[j].indexOf("(") + 1).split(">=")
                  operator = ">="
                }
                else if(lines[j].includes("<="))
                {
                  params = lines[j].substring(lines[j].indexOf("(") + 1).split("<=")
                  operator = "<="
                }
                this.editorVisual.playersLoopIndex++
                if(d === 1)
                {
                  this.editorVisual.Players[player].actions[action].push({title: 'doWhile', class: 'visualD', id: id, inputs: [params[0], operator, params[1].substring(0,params[1].length-1),"","","","",""], pos: this.editorVisual.playersLoopIndex,  true: 0, false: 0})
                  d = 0
                } 
                else
                {
                  this.editorVisual.Players[player].actions[action].push({title: 'While', class: 'visualW', id: id, inputs: [params[0], operator, params[1].substring(0,params[1].length-1),"","","","",""], pos: this.editorVisual.playersLoopIndex,  true: 0, false: 0})
                }
                const dest = [
                  {title: '', class: '' , id: '', inputs: ["","","","","","","",""], pos: 0, true: 0, false: 0}
                ]
                this.editorVisual.PlayersLoops.push(dest)
              }
            }
          }
          break
        case "condition":
          
          break
        case "turn":

          break
      }
    }
    console.log(this.editorVisual)
  }

}
