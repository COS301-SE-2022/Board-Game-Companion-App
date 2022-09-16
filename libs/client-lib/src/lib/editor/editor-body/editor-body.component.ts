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

  constructor(private readonly editorService:EditorService, private readonly dragulaService: DragulaService){
    
  }

  ngOnInit(): void {

    this.dragula.add(this.dragulaService.drop('COPYABLE')
    .subscribe(({name, el, target, source, sibling}) => {
      //Check if new element added or swapping elements
      console.log(this.editorVisual.Players)
      console.log(this.editorVisual.Endgame)
      console.log(target.id)
      if(source !== target)
      {
        console.log(document.getElementById("players")?.contains(target))
        this.count++
        if(document.getElementById("endGame")?.contains(target))
        {
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
          console.log("player")
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

            console.log(this.editorVisual.Players[j])
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
                    console.log("Turn General")
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
                    console.log("Turn General")
                    this.editorVisual.PlayersLoops.push(dest)
                    this.editorVisual.playersLoopIndex++
                    this.editorVisual.Players[player].actions[position][recent].false = this.editorVisual.playersLoopIndex
                    console.log("Turn General")
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
          this.updateVDSL()
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
            this.updateVDSL()
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

  updateVDSL()
  {
    this.editorVisual.clear()
    const lines = this.codeEditor.getValue().split(/\r?\n/)
    console.log(lines)
    let method = ""
    let openPlayer = 0
    let openState = 0
    let openAction = 0
    let openCondition = 0
    let openTurn = 0
    let player = -1
    let action = 0
    let open = 0
    let d = 0
    for(let j = 0; j < lines.length; j++)
    {
      if(lines[j].includes("{"))
      {
        open++
      }
      if(lines[j].includes("state"))
      {
        method = "state"
        openState = open
      }
      else if(lines[j].includes("player"))
      {
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
      else if(lines[j].includes("action"))
      {
        method = "action"
        openAction = open
        const l = lines[j].split(/\s+/)
        this.editorVisual.Players[player].actionNames[action] = l[2].substring(0, l[2].indexOf("("))
        this.editorVisual.Players[player].actionParams[action][0] = l[2].substring(l[2].indexOf("(") + 1, l[2].indexOf(")"))
      }
      else if(lines[j].includes("condition"))
      {
        method = "condtiion"
        openCondition = open
        const l = lines[j].split(/\s+/)
        this.editorVisual.Players[player].conditionParams[action] = l[1].substring(l[1].indexOf("(") + 1, l[1].indexOf(")"))
      }
      else if (lines[j].includes("turn"))
      {
        method = "turn"
        openTurn = open
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
        open--
      }
      else if(open == 0)
      {
        method = ""
      }

      switch(method)
      {
        case "state":
          if(!lines[j].includes("state") && openState != 0)
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
            if(!lines[j].includes("action") && openAction != 0)
            {
              const l = lines[j].split(/\s+/)
              //Create
              if(l[1] == "let")
              {
                this.editorVisual.Players[player].actions[action].push({title: 'Create',  class: 'visualC', id: '', inputs: [l[2],l[4].replace(/'/g, ""),"","","","","",""], pos: 0, true: 0, false: 0})
                this.editorVisual.Variables.push({name: l[2], value: l[4].replace(/'/g, "")})
              }
              //Set
              else if (this.editorVisual.Variables.find(vars => vars.name === l[1]) != null)
              {
                const set = this.editorVisual.Variables.find(vars => vars.name === l[1])
                if(set != null)
                this.editorVisual.Players[player].actions[action].push({title: 'Set',  class: 'visualS', id: '', inputs: [set?.name, l[3].replace(/'/g, ""),"","","","","",""], pos: 0, true: 0, false: 0})
              }
              //Output
              else if (l[1].includes('output('))
              {
                this.editorVisual.Players[player].actions[action].push({title: 'Output', class: 'visualO', id: '', inputs: [l[1].substring(7,l[1].indexOf(")")).replace(/'/g, ""),"","","","","","",""], pos: 0, true: 0, false: 0})
              }
              //Input
              else if(l[1].includes('input('))
              {
                this.editorVisual.Players[player].actions[action].push({title: 'Input', class: 'visualIn', id: '', inputs: [lines[j].substring(lines[j].indexOf("'") + 1, lines[j].indexOf(",") -1),"","","","","","",""], pos: 0, true: 0, false: 0})
              }
              //Methods
              else if(this.editorVisual.methods.find(method => method.name === l[1].substring(0, l[1].indexOf("("))))
              {
                const call = this.editorVisual.methods.find(method => method.name === l[1].substring(0, l[1].indexOf("(")))
                if(call != null)
                {
                  if(call.arguments === 1)
                  {
                    this.editorVisual.Players[player].actions[action].push({title: 'Call', class: 'visualM', id: '', inputs: [call.name, call.arguments.toString(), lines[j].substring(lines[j].indexOf("(") + 1, lines[j].length-1),"","","","",""], pos: 0, true: 0, false: 0})
                  }
                  else
                  {
                    this.editorVisual.Players[player].actions[action].push({title: 'Call', class: 'visualM', id: '', inputs: [call.name, call.arguments.toString(), lines[j].substring(lines[j].indexOf("(") + 1, lines[j].indexOf(",")), lines[j].substring(lines[j].indexOf(",") + 1, lines[j].length-1),"","","",""], pos: 0, true: 0, false: 0})
                  }
                }
              }
              //If Statements
              else if(lines[j].includes("if(") || lines[j].includes("if ("))
              {
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
                this.editorVisual.playersLoopIndex++
                this.editorVisual.Players[player].actions[action].push({title: 'If', class: 'visualIf', id: '', inputs: [params[0], operator, params[1].substring(0,params[1].length-1), "","","","",""], pos: 0,  true: this.editorVisual.playersLoopIndex-1, false: this.editorVisual.playersLoopIndex})
                const dest = [
                  {title: '', class: '' , id: '', inputs: ["","","","","","","",""], pos: 0, true: 0, false: 0}
                ]
                this.editorVisual.PlayersLoops.push(dest)
                this.editorVisual.PlayersLoops.push(dest)
              }
              //For Loops
              else if(lines[j].includes("for(") || lines[j].includes("for ("))
              {
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
                this.editorVisual.Players[player].actions[action].push({title: 'For', class: 'visualF', id: '', inputs: [loop[0].substring(loop[0].length-1),n.toString(),by.toString(),"","","","",""], pos: this.editorVisual.playersLoopIndex,  true: 0, false: 0})
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
                  this.editorVisual.Players[player].actions[action].push({title: 'doWhile', class: 'visualD', id: '', inputs: [params[0], operator, params[1].substring(0,params[1].length-1),"","","","",""], pos: this.editorVisual.playersLoopIndex,  true: 0, false: 0})
                  d = 0
                } 
                else
                {
                  this.editorVisual.Players[player].actions[action].push({title: 'While', class: 'visualW', id: '', inputs: [params[0], operator, params[1].substring(0,params[1].length-1),"","","","",""], pos: this.editorVisual.playersLoopIndex,  true: 0, false: 0})
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
  }

}
