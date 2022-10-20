import { Component, EventEmitter, Input, OnInit ,Output, OnDestroy, ViewChild, AfterViewInit, OnChanges } from '@angular/core';
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
import { LocationStrategy, NgForOf } from '@angular/common';
import { EventListenerFocusTrapInertStrategy } from '@angular/cdk/a11y';
import { Console } from 'console';
import { CollectionsModule } from '../../collections/collections.module';
import { transpilationResponse } from '../../shared/models/editor/transpilationResponse';
import { threadId } from 'worker_threads';
import { AnyARecord } from 'dns';
import { SimpleChanges } from '@angular/core';

@Component({
  selector: 'board-game-companion-app-editor-body',
  templateUrl: './editor-body.component.html',
  styleUrls: ['./editor-body.component.scss'],
})
export class EditorBodyComponent implements OnInit,OnDestroy,AfterViewInit,OnChanges{
 
  @Input() height = 0;
  @Input() width = 0;
  @Input() margin = 0;
  @Input() top = 0;
  @Output() changesTracker = new EventEmitter<number>();
  @Output() newMessageEvent = new EventEmitter<string[]>();
  @Output() newProgramStructureEvent = new EventEmitter<entity>();
  @Output() cursorChangeEvent = new EventEmitter<ace.Ace.Point>();
  @ViewChild(EditorBodyVisualComponent) editorVisual: EditorBodyVisualComponent = new EditorBodyVisualComponent();
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
  showVisual = false;
  @Input() eID = 0
  reinitialized = false;
  created = ""
  container = ""
  player = 0
  action = 0
  condition = 0
  parent = ""
  acIndex = ""
  pcIndex = ""
  editorId = (new Date()).getTime().toString();
  constructor(private readonly editorService:EditorService, private readonly dragulaService: DragulaService){
  }

  ngAfterViewInit(): void{
    this.createEditor();
    this.codeEditor.navigateTo(0,0);
    clearInterval(this.cursorCheckerTimer);

    this.cursorCheckerTimer = window.setInterval(()=>{
      const value = this.codeEditor.getCursorPosition();
      if(value.row != this.cursorPosition.row || value.column != this.cursorPosition.column){
        this.cursorChangeEvent.emit({row:value.row + 1,column:value.column + 1});
        this.cursorPosition = value;
      }
    },500);

    this.updateVDSL()
    
  }

  ngOnInit(): void {

    this.dragula.add(this.dragulaService.remove('COPYABLE')
    .subscribe(({name, el, container, source}) => {
      let exit = true
      let j = 0
      while(exit)
      {
        const c = el.childNodes[j] as HTMLElement
        if(c.nodeName != "#comment" && c.hasAttribute("item-line"))
        {
          this.removeFromContainer( c.getAttribute('item-line') || '', c.className)
          exit = false
        }
        j++
      }
     
      
    }))


    this.dragula.add(this.dragulaService.drop('COPYABLE')
    .subscribe(({name, el, target, source, sibling}) => {
      //Check if new element added or swapping elements
      switch(target.id)
      {
        case "codeArea":
          this.parent = target.previousElementSibling?.getAttribute('item-line') || ""
          this.container = target.id
          break
        case "doArea":
          this.parent = target.nextElementSibling?.getAttribute('item-line') || ""
          this.container = target.id
          break
      }
      if(target.parentElement?.parentElement != null)
      {
        switch(target.parentElement?.parentElement.className)
        {
          case "playerContainers":
            this.parent = "player"
            this.pcIndex = target.parentElement?.parentElement?.getAttribute('playerNumber') || ""
            break
          case "cardContainers":
            this.parent = "card"
            this.pcIndex = target.parentElement?.parentElement?.getAttribute('cardNumber') || ""
            break
          case "listItems":
            this.parent = target.parentElement?.previousElementSibling?.getAttribute('item-line') || ""
            this.container = target.id
            break
        }
        switch(target.parentElement?.parentElement.id)
        {
          case "endGame":
            this.container = "endgame"
            break
          case "action":
            this.container = "action"
            this.acIndex = target.parentElement?.parentElement?.getAttribute('actionNumber') || ""
            break
          case "condition":
            this.container = "condition"
            if(target.parentElement?.parentElement.className == "playerContainers")
            {
              this.acIndex = target.parentElement?.parentElement?.getAttribute('conditionNumber') || ""
            }
            break
          case "turn":
            this.container = "turn"
            this.acIndex = "0"
            break
          case "effect":
            this.container = "effect"
            this.acIndex = "0"
            break
        }
        switch(el.id)
        {
          case "visualC":
            this.created = "create"
            break
          case "visualS":
            this.created = "set"
            break
          case "visualIn":
            this.created = "input"
            break
          case "visualO":
            this.created = "output"
            break
          case "visualM":
            this.created = "method"
            break
          case "visualR":
            this.created = "return"
            break
          case "visualF": 
            this.created = "for"
            break
          case "visualW":
            this.created = "while"
            break
          case "visualD":
            this.created = "do"
            break
          case "visualIf":
            this.created = "if"
            break 
        }
      }
    }));
    const theme = localStorage.getItem("board-game-companion-script-editor-theme");

    if(theme != null)
      this.themeEditor = theme;
  }

  ngOnDestroy(): void {
    clearInterval(this.cursorCheckerTimer);    
    this.codeEditor.destroy();
    this.codeEditor.container.remove();
  }

  ngOnChanges(): void{
    //console.log("changes: " + this.fileLocation);
    if(this.fileLocation !== ""){
      this.editorService.getFileData(this.fileLocation).subscribe({
        next:(value)=>{
          const c = this.codeEditor.getValue()
          this.codeEditor.setValue(value);
          this.codeEditor.navigateTo(0,0);

          this.addState()
          this.addEndGame()
          if(this.created != "")
          {
            this.codeEditor.setValue(c)
            this.addToContainer(this.container, this.created)
          }
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

  removeFromContainer(line : string, type : string)
  {
    const lines = this.codeEditor.getValue().split(/\r?\n/)
    let open = 0
    let start = 0
    let c = 0
    let elseStart = 0
    let end = 0
    switch(type)
    {
      case "visualC":
      case "visualS":
      case "visualIn":
      case "visualO":
      case "visualM":
      case "visualR":
        lines.splice(+line,1)
        this.codeEditor.setValue(lines.join("\n"))
        break
      case "visualIf":
        {
          lines.forEach((element, i) => {
            if(element.includes("{") && start == 1)
            {
              open++
            }

            if(element.includes("}") && start == 1)
            {
              open--
            }

            if(open == 0 && start == 1)
            {
              if(lines[i + 1].includes("else") && c == 0)
              {
                elseStart = 1
                c++
              }
              end = i
              start = 0
            }

            if(element.includes("else") && elseStart == 1)
            {
              start = 1
              elseStart = 0
            }

            if(+line === i)
            {
              start = 1
            }

          })
          console.log(line)
          console.log(end)
         lines.splice(+line, end - (+line) + 1)
         this.codeEditor.setValue(lines.join("\n"))
        }
        break
      case "visualF":
      case "visualW":
        {
          lines.forEach((element, i) => {
            if(element.includes("{") && start == 1)
            {
              open++
            }

            if(element.includes("}") && start == 1)
            {
              open--
            }

            if(open == 0 && start == 1)
            {
              end = i
              start = 0
            }

            if(+line === i)
            {
              start = 1
            }

          })
         lines.splice(+line, end - (+line) + 1)
         this.codeEditor.setValue(lines.join("\n"))
        }
        break
      case "visualD":
        {
          lines.forEach((element, i) => {
            if(element.includes("{") && start == 1)
            {
              open++
            }

            if(element.includes("}") && start == 1)
            {
              open--
            }

            if(open == 0 && start == 1)
            {
              end = i
              start = 0
            }

            if(+line === i)
            {
              start = 1
            }

          })
         lines.splice(+line, end - (+line) + 2)
         this.codeEditor.setValue(lines.join("\n"))
        }
        break
    }
  }

  addElement(lines : string[], openTabs : number, type : string, i : number)
  {
    let tabs = ""
    for(let k = 0; k < openTabs; k++)
    {
      tabs = tabs + "\t"
    }
    switch(type)
    {
      case "create":
        lines.splice(i,0, tabs + "let create" + this.count.toString() + " = cvalue" + this.count.toString())
        break
      case "set":
        lines.splice(i,0, tabs + "set" + this.count.toString() + " = svalue" + this.count.toString())
        break
      case "input":
        lines.splice(i,0, tabs + "input('yes', 'text')")
        break
      case "output":
        lines.splice(i,0, tabs + "output('yes')")
        break
      case "method":
        lines.splice(i,0, tabs + "addToArr(arr,0)")
        break
      case "return":
        lines.splice(i,0, tabs + "return rvalue" + this.count.toString())
        break
      case "for":
        lines.splice(i,0, tabs + "for(x = 0; x < 10; x++)\n" + tabs + "{\n" + tabs + "}\n")
        break
      case "while":
        lines.splice(i,0, tabs + "while(x > 0)\n" + tabs + "{\n" + tabs + "}\n")
        break
      case "do":
        lines.splice(i,0, tabs + "do\n" + tabs + "{\n" + tabs  + "}\n " + tabs +  "while(x > 0)")
        break
      case "if":
        lines.splice(i,0, tabs + "if(x > 0)\n"+ tabs + "{\n" + tabs + "}\n" + tabs + "else\n" + tabs + "{\n" + tabs + "}\n")
        break
    }
  }

  addToContainer(con : string, type : string)
  {
    const lines = this.codeEditor.getValue().split(/\r?\n/)
    let a = -1
    let open = 0
    let openTabs = 0
    let start = 0
    let elseStart = 0
    let twice = 0
    let p = -1
    console.log(con)
    console.log(this.parent)
    lines.forEach((element, i) => {
      switch(con)
      {
        case "codeArea":
        case "doArea":
        case "trueSection":
          {
            if(element.includes("{") && start == 1)
            {
              open++
            }

            if(element.includes("{"))
            {
              openTabs++
            }

            if(element.includes("}") && start == 1)
            {
              open--
            }

            if(element.includes("}") && start != 1)
            {
              openTabs--
            }

            if(start == 1 && open == 0)
            {
              start = 0
              this.addElement(lines, openTabs, type, i)
              
            }

            if(+this.parent === i)
            {
              start = 1
            }
          }
          break
        case "falseSection":
          {
            
            if(element.includes("{") && start == 1)
            {
              open++
            }

            if(element.includes("{"))
            {
              openTabs++
            }

            if(element.includes("}") && start == 1)
            {
              open--
            }

            if(element.includes("}") && elseStart != 1)
            {
              openTabs--
            }

            if(start == 1 && open == 0 && elseStart == 1)
            {
              start = 0
              this.addElement(lines, openTabs, type, i)
            }

            if(+this.parent === i)
            {
              start = 1
            }

            if(element.includes("else") && start == 1 && open == 0)
            {
              console.log(i)
              elseStart = 1
            }
          }
          break
        case "endgame":
          twice = 0
          if(element.includes("{"))
          {
            openTabs++
          }

          if(element.includes("{") && a > -1) 
          {
            open++
            twice++
            console.log(open)
          }

          if(element.includes("}"))
          {
            openTabs--
          }

          if(element.includes("}") && a > -1)
          {
            console.log(i)
            open--
          }
          
          if(a > -1 && open == 0)
          {
            openTabs++
            this.addElement(lines, openTabs, type, i)
            a = -10
          }
          if(element.includes(con))
          {
            a++
          }

          if(element.includes("{") && a > -1 && twice == 0)
          {
            open++
            console.log(open)
          }
          break
        case "turn":
        case "effect":
        case "condition":
        case "action":
          if(element.includes("{"))
          {
            openTabs++
          }

          if(element.includes("}"))
          {
            openTabs--
          }

          if(element.includes(this.parent))
          {
            p++
            console.log(this.pcIndex)
          }

          if(element.includes("}") && a == +this.acIndex && p == +this.pcIndex)
          {
            open--
            console.log(i)
          }

          if(a == +this.acIndex && p == +this.pcIndex &&  open == 0)
          {
            openTabs++
            this.addElement(lines, openTabs, type, i)
            a = -10
          }

          if(element.includes(con) && p == +this.pcIndex)
          {
            a++
          }

          if(element.includes("{") && a == +this.acIndex && p == +this.pcIndex)
          {
            open++
          }
          break
      }
    })
    this.codeEditor.setValue(lines.join("\n"))    
    
  }

  

  createEditor():void{

    this.codeEditor =  ace.edit(this.editorId); 
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
    this.showVisual = value;
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
            this.updateVDSL()
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

  countTabs(lines : string[], value : number) : string
  {
    let index = 0
    let count = 0
    while(lines[value].charAt(index++) === "\t")
    {
      count++
    }
    let tabs = ""
    for(let x = 0; x < count; x++)
    {
      tabs = tabs + "\t"
    }
    return tabs
  }

  updateElement(event : string)
  {
    const value = event.split("+")
    const lines = this.codeEditor.getValue().split(/\r?\n/)
    let param = ""
    if(value[1].includes("mvalues") || value[1].includes("ifCompare") || value[1].includes("ifInput"))
    {
      param = value[1].substring(value[1].length-1)
      value[1] = value[1].substring(0, value[1].length-1)
    }
    switch(value[1])
    {
      case "name":
        {
          const c = lines[+value[2]].split(/\s/).filter(a => a !== '')
          const tabs = this.countTabs(lines, +value[2])
          c[1] = value[0]
          c[0] = tabs + c[0]
          lines[+value[2]] = c.join(" ")
          this.codeEditor.setValue(lines.join("\n"))
        } 
        break
      case "csvalue":
        {
          const c = lines[+value[2]].split(/\s/).filter(a => a !== '')
          const tabs = this.countTabs(lines, +value[2])
          c[c.length-1] = value[0]
          c[0] = tabs + c[0]
          lines[+value[2]] = c.join(" ")
          this.codeEditor.setValue(lines.join("\n"))
        }
        break
      case "sname":
        {
          const c = lines[+value[2]].split(/\s/).filter(a => a !== '')
          const tabs = this.countTabs(lines, +value[2])
          c[0] = value[0]
          c[0] = tabs + c[0]
          lines[+value[2]] = c.join(" ")
          this.codeEditor.setValue(lines.join("\n"))
        }
        break
      case "iovalue":
        {
          const c = lines[+value[2]].split(/,/).filter(a => a !== '')
          const tabs = this.countTabs(lines, +value[2])
          if(c[0].includes("input("))
          {
            c[0] = tabs + "input(" + value[0] + ","
          }
          else
          {
            c[0] = tabs + "output(" + value[0] + ")"
          }
          lines[+value[2]] = c.join(" ")
          this.codeEditor.setValue(lines.join("\n"))
        }
        break
      case "method":
        {
          const c = lines[+value[2]].split(/,/).filter(a => a !== '')
          const o = this.editorVisual.methods.find(a => a.name === value[0])
          const tabs = this.countTabs(lines, +value[2])
          let count = ""
          if(o != null)
          {
            console.log(o?.arguments)
            for(let j = 0; j  < o?.arguments; j++)
            {
              if(j !== 0)
              {
                count = count + ", val"
              }
            }
            if(o.name == "consider:")
            {
              lines[+value[2]] = tabs + o.name + "this.State.board"
            }
            else
            {
              lines[+value[2]] = tabs + o.name + "(val1" + count + ")"
            }
            
          }
          this.codeEditor.setValue(lines.join("\n"))
        }
        break
      case "mvalues":
        {
          const c = lines[+value[2]].split(/,/).filter(a => a !== '')
          if(+param == 0 && c.length != 1)
          {
            c[+param] = c[+param].substring(0, c[+param].indexOf("(")+1) + value[0]
          }
          else if(c.length == 1)
          {
            c[+param] = c[+param].substring(0, c[+param].indexOf("(")+1) + value[0] + ")"
          }
          else
          {
            c[+param] = value[0] + ")"
          }
          lines[+value[2]] = c.join(",")
          this.codeEditor.setValue(lines.join("\n"))
        }
        break
      case "rvalue":
        {
          const c = lines[+value[2]].split(/\s/).filter(a => a !== '')
          const tabs = this.countTabs(lines, +value[2])
          c[0] = tabs + c[0]
          c[1] = value[0]
          lines[+value[2]] = c.join(" ")
          this.codeEditor.setValue(lines.join("\n"))
        }
        break
      case "ifOperator":
        {
          switch(value[0])
          {
            case "add":
              {
                let c = lines[+value[2]]
                const operator = " && x > 0)"
                c = c.replace(")",operator)
                lines[+value[2]] = c
                this.codeEditor.setValue(lines.join("\n"))
              }
              break
            case "remove":
              {
                const and = lines[+value[2]].lastIndexOf("&&")
                const or =  lines[+value[2]].lastIndexOf("||")
                if(and > or)
                {
                  lines[+value[2]] = lines[+value[2]].substring(0,and) + ")"
                }
                else
                {
                  lines[+value[2]] = lines[+value[2]].substring(0,or) + ")"
                }
                this.codeEditor.setValue(lines.join("\n"))
              }
              break
          }
          
        }
        break
      case "else":
        {
          switch(value[0])
          {
            case "remove":
              {
                let open = 0
                let elseStart = -1
                let end = 0
                let exit = true
                let j = +value[2]
                while(exit)
                {
                  if(lines[j].includes("{"))
                  {
                    open++
                  }

                  if(lines[j].includes("}"))
                  {
                    open--
                  }

                  if(open == 0 && elseStart != -1)
                  {
                    end = j
                    exit = false
                  }
                  
                  if(lines[j].includes("else") && open == 0)
                  {
                    elseStart = j
                  }

                  j++
                }
                lines.splice(elseStart, end - elseStart + 1)
                this.codeEditor.setValue(lines.join("\n"))
              }
              break
            case "add":
              {
                let open = 0
                let elseStart = -1
                let exit = true
                let j = +value[2]
                while(exit)
                {
                  if(lines[j].includes("{"))
                  {
                    open++
                  }

                  if(lines[j].includes("}"))
                  {
                    open--
                  }

                  if(open == 0 &&  !lines[j].includes("if") && !lines[j].includes("("))
                  {
                    j++
                    elseStart = j
                    exit = false
                  }
                  
                  j++
                }
                const tabs = this.countTabs(lines, +value[2])
                lines.splice(elseStart, 0, tabs + "else", tabs+ "{" , tabs + "}")
                this.codeEditor.setValue(lines.join("\n"))
              }
              break
          }
        }
        break
      case "ifCompare":
      case "ifInput":
        {
          const c = lines[+value[2]].split(/\s/).filter(a => a !== '')
          const tabs = this.countTabs(lines, +value[2])
          if(c[+param - 1].includes("if(") || c[+param - 1].includes("if ("))
          {
            c[+param - 1] = c[+param - 1].substring(0, c[+param - 1].indexOf("(") + 1) + value[0]
          }
          else if (c[+param - 1].includes(")"))
          {
            c[+param - 1] =  value[0] + ")"
          }
          else
          {
            c[+param - 1] = value[0]
          }
          c[0] = tabs + c[0]
          lines[+value[2]] = c.join(" ")
          this.codeEditor.setValue(lines.join("\n"))
        }
        break
    }
  }

  addState()
  {
    if(!this.codeEditor.getValue().includes("state"))
    {
      const sc = "state\n{\n}\n"
      this.codeEditor.setValue(sc)
    }
  }

  addEndGame()
  {
    if(!this.codeEditor.getValue().includes("endgame"))
    {
      const sc = "endgame\n{\n}\n"
      const lines = this.codeEditor.getValue().split(/\r?\n/)
      console.log("pain")
      this.codeEditor.setValue(this.codeEditor.getValue() + sc)
    }
  }

  updateCard(event : any)
  {
    const value = event.split(/\s/)
    const lines = this.codeEditor.getValue().split(/\r?\n/)
    let c = 0
    switch(value[0])
    {
      case "name":
        lines.forEach((element, i) => {
          if(element.includes("card "))
          {
            c++
          }

          if(c - 1 == +value[2])
          {
            lines[i] = lines[i].replace(this.editorVisual.Cards[+value[2]].name, value[1])
            c = - 100
          }
        })
        this.codeEditor.setValue(lines.join("\n"))
        break
      case "param":
        lines.forEach((element, i) => {
          if(element.includes("card "))
          {
            c++
          }

          if(c - 1 == +value[2])
          {
            if(element.includes("()"))
            {
              lines[i] = lines[i].replace("()", "(" + value[1] + ")")
            }
            else
            {
              lines[i] = lines[i].replace("(" + this.editorVisual.Cards[+value[2]].parameter + ")", "(" + value[1] + ")")
            }
            c = - 100
          }
        })
        this.codeEditor.setValue(lines.join("\n"))
        break
    }
  }

  removeCard(event : any)
  {
    const lines = this.codeEditor.getValue().split(/\r?\n/)
    let c = 0
    let start = 0
    let end = 0
    lines.forEach((element, i) => {
      if(element.includes("card "))
      {
        c++
        start = i
      }
      if(c - 1 == event &&  element == "}")
      {
        end = i
        c = -100
      }
    })
    lines.splice(start,end - start + 1)
    this.codeEditor.setValue(lines.join("\n"))
  }

  addCard(event : any)
  {
    this.addState()
    const player = "card Name" + event.toString() +"(t){\n\teffect{\n\n\t}\n\tcondition{\n\n\t}\n}\n"
    this.codeEditor.setValue(this.codeEditor.getValue() + player)
  }

  removeActionCondition(event : any)
  {
    const value = event.split(/\s/)
    const lines = this.codeEditor.getValue().split(/\r?\n/)
    let c = 0
    let a = 0
    let start = 0
    let end = 0
    lines.forEach((element, i) => {
      if(element.includes("player "))
      {
        c++
        a = 0
      }
      else if(element.includes("action "))
      {
        start = i
      }
      else if (element.includes("condition(") || element.includes("condition ("))
      {
        a++
      }
      else if(element.includes("\t}") && a - 1 == +value[0])
      {
        end = i
      }

      if(c - 1 == +value[1] && a - 1 == +value[0] && end > 0)
      {
        lines.splice(start,end - start + 1)
        this.codeEditor.setValue(lines.join("\n"))
        c = - 100
      }
    })
  }

  addActionCondition(event : any)
  {
    const lines = this.codeEditor.getValue().split(/\r?\n/)
    let c = 0
    let a = 0
    let t = 0
    lines.forEach((element, i) => {
      if(element.includes("player "))
      {
        c++
        a = 0
        t = 0
      }
      else if (element.includes("action "))
      {
        a++
      }
      else if(element.includes("turn()") || element.includes("turn ()"))
      {
        t++
      }
      if(t > 0 && c - 1 == event)
      {
        const ac = "\taction " + "aName" + a.toString() + "(){\n\n\t}\n\tcondition(){\n\n\t}\n"
        lines.splice(i,0,ac)
        c = - 100
      }
    })
    this.codeEditor.setValue(lines.join("\n"))
  }

  updatePlayer(event : string)
  {
    const value = event.split(/\s/).filter(a => a !== '')
    const lines = this.codeEditor.getValue().split(/\r?\n/)
    let c = 0
    let a = 0
    switch(value[0])
    {
      case "name":
        lines.forEach((element, i) => {
          if(element.includes("player "))
          {
            c++
          }

          if(c - 1 == +value[2])
          {
            lines[i] = lines[i].replace(this.editorVisual.Players[+value[2]].name, value[1])
            c = - 100
          }
        })
        this.codeEditor.setValue(lines.join("\n"))
        break
      case "action":
        lines.forEach((element, i) => {
          if(element.includes("player "))
          {
            c++
            a = 0
          }
          
          if(element.includes("action "))
          {
            a++
          }

          if(c - 1 == +value[2] && a - 1 == +value[3])
          {
            console.log(lines[i])
            lines[i] = lines[i].replace(this.editorVisual.Players[+value[2]].actionNames[+value[3]], " " + value[1])
            c = - 100
          }
        })
        this.codeEditor.setValue(lines.join("\n"))
        break
      case "actionParam":
        lines.forEach((element, i) => {
          if(element.includes("player "))
          {
            c++
            a = 0
          }
          
          if (element.includes("action "))
          {
            a++
          }

          if(c - 1 == +value[2] && a - 1 == +value[3])
          {
            if(element.includes("()"))
            {
              lines[i] = lines[i].replace("()", "(" + value[1] + ")")
            }
            else
            {
              lines[i] = lines[i].replace("("+ this.editorVisual.Players[+value[2]].actionParams[+value[3]] + ")", "(" + value[1] + ")")
            }
            c = - 100
          }
        })
        this.codeEditor.setValue(lines.join("\n"))
        break
      case "conditionParam":
        lines.forEach((element, i) => {
          if(element.includes("player "))
          {
            c++
            a = 0
          }
          if (element.includes("condition(") || element.includes("condition ("))
          {
            a++
          }

          if(c - 1 == +value[2] && a - 1 == +value[3])
          {
            if(element.includes("()"))
            {
              console.log("yes")
              lines[i] = lines[i].replace("()", "(" + value[1] + ")")
            }
            else
            {
              lines[i] = lines[i].replace("("+ this.editorVisual.Players[+value[2]].conditionParams[+value[3]] + ")", "(" + value[1] + ")")
            }
            c = - 100
          }
        })
        this.codeEditor.setValue(lines.join("\n"))
        break
    }
  }

  addPlayer(event : any){
    this.addState()
    const player = "player Name" + event.toString() +"{\n\taction aName" + event.toString() + "(){\n\n\t}\n\tcondition(){\n\n\t}\n\tturn(){\n\n\t}\n}\n"
    this.codeEditor.setValue(this.codeEditor.getValue() + player)
  }
  removePlayer(event : any)
  {
    const lines = this.codeEditor.getValue().split(/\r?\n/)
    let c = 0
    let start = 0
    let end = 0
    lines.forEach((element, i) => {
      if(element.includes("player "))
      {
        c++
        start = i
      }
      if(c - 1 == event &&  element == "}")
      {
        end = i
        c = -100
      }
    })
    lines.splice(start,end - start + 1)
    this.codeEditor.setValue(lines.join("\n"))
  }

  removeTiles(event : any) : void
  {
    let lines = this.codeEditor.getValue().split(/\r?\n/)
    lines = lines.filter((element) => {
      return !element.includes("[" + event + "].")
    })
    let state = 0
    lines.forEach((element, i)=>{
      if(element.includes("state"))
      {
        state++
      }
      else if(element.includes("}") && state > 0)
      {
        state = -2
      }
      else if(element.includes("["))
      {
        const num = lines[i].match(/\d/)
        if(num != null)
        {
          if(+num[0] > +event)
          {
            const n = +num[0] - 1
            lines[i] = lines[i].replace(/\[(.+?)\]/g, "["+n.toString()+"]")
          }
        }
      }
    })
    const index = lines.findIndex((element) => element.includes("createBoard("))
    const n = lines[index].match(/\d+/)
    if(n != null)
    {
      lines[index] = "\tcreateBoard(" + (+n - 1) + ")"
      this.codeEditor.setValue(lines.join("\n"))
    }
    
  }

  addTiles(event : any) : void
  {
    this.addState()
    if(!this.codeEditor.getValue().includes("createBoard("))
    {
      const lines = this.codeEditor.getValue().split(/\r?\n/)
      for(let j = 0; j < lines.length; j++)
      {
        if(lines[j].includes("state") && lines[j].includes("{"))
        {
          lines.splice(j+1,0, "\tcreateBoard(" + event + ")")
          this.codeEditor.setValue(lines.join("\n"))
          break
        }
        else if(lines[j].includes("state") && lines[j + 1].includes("{"))
        {
          lines.splice(j+2,0, "\tcreateBoard(" + event + ")")
          this.codeEditor.setValue(lines.join("\n"))
          break
        }
      }
    }
    else
    {
      const lines = this.codeEditor.getValue().split(/\r?\n/)
      const index = lines.findIndex((element) => element.includes("createBoard("))
      lines[index] = "\tcreateBoard(" + event + ")"
      this.codeEditor.setValue(lines.join("\n"))
    }
  }

  editTiles(event: any)
  {
    const lines = this.codeEditor.getValue().split(/\r?\n/)
    const tile = event.split(/\s/)
    const property = "[" + tile[1] + "]" + "." + this.editorVisual.listProperties[+tile[2]]
    console.log(property)
    let state = 0
    if(!this.codeEditor.getValue().includes(property))
    {
      lines.forEach((element, i)=>{
        if(element.includes("state"))
        {
          state++
        }
        if(element.includes("}") && state > 0)
        {
          lines.splice(i,0,"\tboard" + property + " = " + tile[0])
          this.codeEditor.setValue(lines.join("\n"))
          state = 0
        }
      })
    }
    else
    {
      lines.forEach((element, i)=>{
        if(element.includes(property) && state == 0)
        {
          const c = element.split(/=/)
          c[1] = tile[0]
          lines.splice(i,1, c.join("= "))
          this.codeEditor.setValue(lines.join("\n"))
          state++
        }
      })
    }
  }

  removeProperty(event: any): void
  {
    const lines = this.codeEditor.getValue().split(/\r?\n/)
    lines.splice(+event,1)
    this.codeEditor.setValue(lines.join("\n"))
  }


  updateProperty(event: any): void
  {
    this.addState()
    const property = event.split(/\s/)
    const lines = this.codeEditor.getValue().split(/\r?\n/)
    if(!this.codeEditor.getValue().includes("tileAttribute"))
    {
      const sc = "tileAttribute\n{\n" + "\t" + this.editorVisual.Properties[+property[3]].Property + " = " + this.editorVisual.Properties[+property[3]].Value + "\n}\n" + this.codeEditor.getValue()
      this.codeEditor.setValue(sc)
    }
    else
    {
      
      if(this.editorVisual.Properties[+property[3]].Line == '')
      {
        if(this.editorVisual.Properties[+property[3]-1] !== undefined)
        {
          lines.splice(+this.editorVisual.Properties[+property[3]-1].Line + 1, 0, "\t" + this.editorVisual.Properties[+property[3]].Property + " = " + this.editorVisual.Properties[+property[3]].Value)
        }
        else
        {
          const index = lines.findIndex((element) => element.includes("{"))
          lines.splice(index+1, 0, "\t" + this.editorVisual.Properties[+property[3]].Property + " = " + this.editorVisual.Properties[+property[3]].Value)
        }
        this.codeEditor.setValue(lines.join("\n"))
      }
      else
      {
        let line = lines[+property[2]].split(/\s/)
        line = line.filter((element) => {
          return element !== '';
        })
        switch(property[1])
        {
          case "name":
            line[0] = "\t" + property[0]
            lines[+property[2]] = line.join(" ")
            break
          case "value":
            line[0] = "\t" + line[0]
            line[2] = property[0]
            lines[+property[2]] = line.join(" ")
            break
        }
        this.codeEditor.setValue(lines.join("\n"))
      }
      

    }
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
    const condi = l.substring(l.indexOf("(") + 1, l.indexOf(")")).replace(/\s/g, '').split(/[&&,||]/).filter(a => a !== '')
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

  ifCreation(parent : string, j : number)
  {
    const dest = [
      {title: '', class: '' , id: '', inputs: ["","","","","","","",""], pos: 0, true: 0, false: 0, lineNumber: j.toString()}
    ]
    const dest2 = [
      {title: '', class: '' , id: '', inputs: ["","","","","","","",""], pos: 0, true: 0, false: 0, lineNumber: j.toString()}
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

  loopCreation(parent : string, j : number)
  {
    const dest = [
      {title: '', class: '' , id: '', inputs: ["","","","","","","",""], pos: 0, true: 0, false: 0, lineNumber: j.toString()}
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

  letCreation(l : string[], openIf : number, player : number, action : number, ifContains : number, method : string, parent : string, card : number, j : number)
  {
    const id = this.getEID()
    if(openIf > 0)
    {
      switch(parent)
      {
        case "player":
          this.editorVisual.PlayersLoops[ifContains].push({title: 'Create',  class: 'visualC', id: id, inputs: [l[2],l[4].replace(/'/g, ""),"","","","","",""], pos: 0, true: 0, false: 0, lineNumber: j.toString()})
          break
        case "card":
          this.editorVisual.CardsLoop[ifContains].push({title: 'Create',  class: 'visualC', id: id, inputs: [l[2],l[4].replace(/'/g, ""),"","","","","",""], pos: 0, true: 0, false: 0, lineNumber: j.toString()})
          break
        case "endGame":
          this.editorVisual.EndgameLoops[ifContains].push({title: 'Create',  class: 'visualC', id: id, inputs: [l[2],l[4].replace(/'/g, ""),"","","","","",""], pos: 0, true: 0, false: 0, lineNumber: j.toString()})
          break
      }
      
    }
    else
    {
      switch(method)
      {
        case "action":
          this.editorVisual.Players[player].actions[action].push({title: 'Create',  class: 'visualC', id: id, inputs: [l[2],l[4].replace(/'/g, ""),"","","","","",""], pos: 0, true: 0, false: 0, lineNumber: j.toString()})
          break
        case "condition":
          switch(parent)
          {
            case "player":
              this.editorVisual.Players[player].conditions[action].push({title: 'Create',  class: 'visualC', id: id, inputs: [l[2],l[4].replace(/'/g, ""),"","","","","",""], pos: 0, true: 0, false: 0, lineNumber: j.toString()})
              break
            case "card":
              this.editorVisual.Cards[card].condition.push({title: 'Create',  class: 'visualC', id: id, inputs: [l[2],l[4].replace(/'/g, ""),"","","","","",""], pos: 0, true: 0, false: 0, lineNumber: j.toString()})
              break
          }    
          break
        case "turn":
          this.editorVisual.Players[player].turn[0].push({title: 'Create',  class: 'visualC', id: id, inputs: [l[2],l[4].replace(/'/g, ""),"","","","","",""], pos: 0, true: 0, false: 0, lineNumber: j.toString()})
          break
        case "endGame":
          this.editorVisual.Endgame.push({title: 'Create',  class: 'visualC', id: id, inputs: [l[2],l[4].replace(/'/g, ""),"","","","","",""], pos: 0, true: 0, false: 0, lineNumber: j.toString()})
          break
        case "effect":
          this.editorVisual.Cards[card].effect.push({title: 'Create',  class: 'visualC', id: id, inputs: [l[2],l[4].replace(/'/g, ""),"","","","","",""], pos: 0, true: 0, false: 0, lineNumber: j.toString()})
          break
      }
      
    }
    this.editorVisual.Variables.push({name: l[2], value: l[4].replace(/'/g, "")})
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
            this.editorVisual.PlayersLoops[ifContains].push({title: 'Set',  class: 'visualS', id: id, inputs: [set?.name, lines[j].substring(lines[j].indexOf("=") + 1),"","","","","",""], pos: 0, true: 0, false: 0, lineNumber: j.toString()})
            break
          case "card":
            this.editorVisual.CardsLoop[ifContains].push({title: 'Set',  class: 'visualS', id: id, inputs: [set?.name, lines[j].substring(lines[j].indexOf("=") + 1),"","","","","",""], pos: 0, true: 0, false: 0, lineNumber: j.toString()})
            break
          case "endGame":
            this.editorVisual.EndgameLoops[ifContains].push({title: 'Set',  class: 'visualS', id: id, inputs: [set?.name, lines[j].substring(lines[j].indexOf("=") + 1),"","","","","",""], pos: 0, true: 0, false: 0, lineNumber: j.toString()})
            break
        }
      }
      else
      {
        switch(method)
        {
          case "action":
            this.editorVisual.Players[player].actions[action].push({title: 'Set',  class: 'visualS', id: id, inputs: [set?.name, lines[j].substring(lines[j].indexOf("=") + 1),"","","","","",""], pos: 0, true: 0, false: 0, lineNumber: j.toString()})
            break
          case "condition":
            switch(parent)
            {
              case "player":
                this.editorVisual.Players[player].conditions[action].push({title: 'Set',  class: 'visualS', id: id, inputs: [set?.name, lines[j].substring(lines[j].indexOf("=") + 1),"","","","","",""], pos: 0, true: 0, false: 0, lineNumber: j.toString()})
                break
              case "card":
                this.editorVisual.Cards[card].condition.push({title: 'Set',  class: 'visualS', id: id, inputs: [set?.name, lines[j].substring(lines[j].indexOf("=") + 1),"","","","","",""], pos: 0, true: 0, false: 0, lineNumber: j.toString()})
                break
            }
            break
          case "turn":
            this.editorVisual.Players[player].turn[0].push({title: 'Set',  class: 'visualS', id: id, inputs: [set?.name, lines[j].substring(lines[j].indexOf("=") + 1),"","","","","",""], pos: 0, true: 0, false: 0, lineNumber: j.toString()})
            break
          case "endGame":
            this.editorVisual.Endgame.push({title: 'Set',  class: 'visualS', id: id, inputs: [set?.name, lines[j].substring(lines[j].indexOf("=") + 1),"","","","","",""], pos: 0, true: 0, false: 0, lineNumber: j.toString()})
            break
          case "playerCodeArea":
            this.editorVisual.Players[player].playerCode[0].push({title: 'Set',  class: 'visualS', id: id, inputs: [set?.name, lines[j].substring(lines[j].indexOf("=") + 1),"","","","","",""], pos: 0, true: 0, false: 0, lineNumber: j.toString()})
            break
          case "effect":
            this.editorVisual.Cards[card].effect.push({title: 'Set',  class: 'visualS', id: id, inputs: [set?.name, lines[j].substring(lines[j].indexOf("=") + 1),"","","","","",""], pos: 0, true: 0, false: 0, lineNumber: j.toString()})
            break
        }
       
      }  
    }
  }

  ioCreation(lines: string[], j : number, openIf : number, ifContains: number, player: number, action: number, method : string, title : string, classes : string, parent : string, card : number)
  {
    const id = this.getEID()
    const c = lines[j].split(/,/).filter(a => a !== '')
    let input = ""
    switch(classes)
    {
      case "visualIn":
        input = c[0].substring(c[0].indexOf("(") + 1, c[0].length)
        break
      case "visualO":
        input = c[0].substring(c[0].indexOf("(") + 1, c[0].length - 1)
        break
    }
    
    console.log(input)
    if(openIf > 0)
    {
      switch(parent)
      {
        case "player":
          this.editorVisual.PlayersLoops[ifContains].push({title: title, class: classes, id: id, inputs: [input,"","","","","","",""], pos: 0, true: 0, false: 0, lineNumber: j.toString()})
          break
        case "card":
          this.editorVisual.CardsLoop[ifContains].push({title: title, class: classes, id: id, inputs: [input,"","","","","","",""], pos: 0, true: 0, false: 0, lineNumber: j.toString()})
          break
        case "endGame":
          this.editorVisual.EndgameLoops[ifContains].push({title: title, class: classes, id: id, inputs: [input,"","","","","","",""], pos: 0, true: 0, false: 0, lineNumber: j.toString()})
          break
      }
    }
    else
    {
      switch(method)
      {
        case "action":
          this.editorVisual.Players[player].actions[action].push({title: title, class: classes, id: id, inputs: [input,"","","","","","",""], pos: 0, true: 0, false: 0, lineNumber: j.toString()})
          break
        case "condition":
          switch(parent)
          {
            case "player":
              this.editorVisual.Players[player].conditions[action].push({title: title, class: classes, id: id, inputs: [input,"","","","","","",""], pos: 0, true: 0, false: 0, lineNumber: j.toString()})
              break
            case "card":
              this.editorVisual.Cards[card].condition.push({title: title, class: classes, id: id, inputs: [input,"","","","","","",""], pos: 0, true: 0, false: 0, lineNumber: j.toString()})
              break
          }
          break
        case "turn":
          this.editorVisual.Players[player].turn[0].push({title: title, class: classes, id: id, inputs: [input,"","","","","","",""], pos: 0, true: 0, false: 0, lineNumber: j.toString()})
          break
        case "endGame":
          this.editorVisual.Endgame.push({title: title, class: classes, id: id, inputs: [input,"","","","","","",""], pos: 0, true: 0, false: 0, lineNumber: j.toString()})
          break
        case "effect":
          this.editorVisual.Cards[card].effect.push({title: title, class: classes, id: id, inputs: [input,"","","","","","",""], pos: 0, true: 0, false: 0, lineNumber: j.toString()})
          break
      }
      
    } 
  }



  methodCreation(lines: string[], j : number, l : string[], openIf : number, ifContains: number, player: number, action: number, method : string, parent : string, card : number)
  {
    const id = this.getEID()
    const call = this.editorVisual.methods.find(method => method.name === l[1].substring(0, l[1].indexOf("(")))
    if(l[1].includes("consider:"))
    {
      this.editorVisual.Players[player].conditions[action].push({title: 'Call', class: 'visualM', id: id, inputs: ["consider:", "1", l[1].substring(l[1].indexOf(":") + 1),"","","","",""], pos: 0, true: 0, false: 0, lineNumber: j.toString()})
    }
    else if(call != null)
    {
      if(call.arguments === 1)
      {
        if(openIf > 0)
        {
          switch(parent)
          {
            case "player":
              this.editorVisual.PlayersLoops[ifContains].push({title: 'Call', class: 'visualM', id: id, inputs: [call.name, call.arguments.toString(), lines[j].substring(lines[j].indexOf("(") + 1, lines[j].length-1),"","","","",""], pos: 0, true: 0, false: 0, lineNumber: j.toString()})
              break
            case "card":
              this.editorVisual.CardsLoop[ifContains].push({title: 'Call', class: 'visualM', id: id, inputs: [call.name, call.arguments.toString(), lines[j].substring(lines[j].indexOf("(") + 1, lines[j].length-1),"","","","",""], pos: 0, true: 0, false: 0, lineNumber: j.toString()})
              break
            case "endGame":
              this.editorVisual.EndgameLoops[ifContains].push({title: 'Call', class: 'visualM', id: id, inputs: [call.name, call.arguments.toString(), lines[j].substring(lines[j].indexOf("(") + 1, lines[j].length-1),"","","","",""], pos: 0, true: 0, false: 0, lineNumber: j.toString()})
              break
          } 
        }
        else
        {
          switch(method)
          {
            case "action":
              this.editorVisual.Players[player].actions[action].push({title: 'Call', class: 'visualM', id: id, inputs: [call.name, call.arguments.toString(), lines[j].substring(lines[j].indexOf("(") + 1, lines[j].length-1),"","","","",""], pos: 0, true: 0, false: 0, lineNumber: j.toString()})
              break
            case "condition":
              switch(parent)
              {
                case "player":
                  this.editorVisual.Players[player].conditions[action].push({title: 'Call', class: 'visualM', id: id, inputs: [call.name, call.arguments.toString(), lines[j].substring(lines[j].indexOf("(") + 1, lines[j].length-1),"","","","",""], pos: 0, true: 0, false: 0, lineNumber: j.toString()})
                  break
                case "card":
                  this.editorVisual.Cards[card].condition.push({title: 'Call', class: 'visualM', id: id, inputs: [call.name, call.arguments.toString(), lines[j].substring(lines[j].indexOf("(") + 1, lines[j].length-1),"","","","",""], pos: 0, true: 0, false: 0, lineNumber: j.toString()})
                  break
              }
              break
            case "turn":
              this.editorVisual.Players[player].turn[0].push({title: 'Call', class: 'visualM', id: id, inputs: [call.name, call.arguments.toString(), lines[j].substring(lines[j].indexOf("(") + 1, lines[j].length-1),"","","","",""], pos: 0, true: 0, false: 0, lineNumber: j.toString()})
              break
            case "endGame":
              this.editorVisual.Endgame.push({title: 'Call', class: 'visualM', id: id, inputs: [call.name, call.arguments.toString(), lines[j].substring(lines[j].indexOf("(") + 1, lines[j].length-1),"","","","",""], pos: 0, true: 0, false: 0, lineNumber: j.toString()})
              break
            case "effect":
              this.editorVisual.Cards[card].effect.push({title: 'Call', class: 'visualM', id: id, inputs: [call.name, call.arguments.toString(), lines[j].substring(lines[j].indexOf("(") + 1, lines[j].length-1),"","","","",""], pos: 0, true: 0, false: 0, lineNumber: j.toString()})
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
              this.editorVisual.PlayersLoops[ifContains].push({title: 'Call', class: 'visualM', id: id, inputs: [call.name, call.arguments.toString(), lines[j].substring(lines[j].indexOf("(") + 1, lines[j].indexOf(",")), lines[j].substring(lines[j].indexOf(",") + 1, lines[j].length-1),"","","",""], pos: 0, true: 0, false: 0, lineNumber: j.toString()})
              break
            case "card":
              this.editorVisual.CardsLoop[ifContains].push({title: 'Call', class: 'visualM', id: id, inputs: [call.name, call.arguments.toString(), lines[j].substring(lines[j].indexOf("(") + 1, lines[j].indexOf(",")), lines[j].substring(lines[j].indexOf(",") + 1, lines[j].length-1),"","","",""], pos: 0, true: 0, false: 0, lineNumber: j.toString()})
              break
            case "endGame":
              this.editorVisual.EndgameLoops[ifContains].push({title: 'Call', class: 'visualM', id: id, inputs: [call.name, call.arguments.toString(), lines[j].substring(lines[j].indexOf("(") + 1, lines[j].indexOf(",")), lines[j].substring(lines[j].indexOf(",") + 1, lines[j].length-1),"","","",""], pos: 0, true: 0, false: 0, lineNumber: j.toString()})
              break
          }
        }
        else
        {
          switch(method)
          {
            case "action":
              this.editorVisual.Players[player].actions[action].push({title: 'Call', class: 'visualM', id: id, inputs: [call.name, call.arguments.toString(), lines[j].substring(lines[j].indexOf("(") + 1, lines[j].indexOf(",")), lines[j].substring(lines[j].indexOf(",") + 1, lines[j].length-1),"","","",""], pos: 0, true: 0, false: 0, lineNumber: j.toString()})
              break
            case "condition":
              switch(parent)
              {
                case "player":
                  this.editorVisual.Players[player].conditions[action].push({title: 'Call', class: 'visualM', id: id, inputs: [call.name, call.arguments.toString(), lines[j].substring(lines[j].indexOf("(") + 1, lines[j].indexOf(",")), lines[j].substring(lines[j].indexOf(",") + 1, lines[j].length-1),"","","",""], pos: 0, true: 0, false: 0, lineNumber: j.toString()})
                  break
                case "card":
                  this.editorVisual.Cards[card].condition.push({title: 'Call', class: 'visualM', id: id, inputs: [call.name, call.arguments.toString(), lines[j].substring(lines[j].indexOf("(") + 1, lines[j].indexOf(",")), lines[j].substring(lines[j].indexOf(",") + 1, lines[j].length-1),"","","",""], pos: 0, true: 0, false: 0, lineNumber: j.toString()})
                  break
              }
              break
            case "turn":
              this.editorVisual.Players[player].turn[0].push({title: 'Call', class: 'visualM', id: id, inputs: [call.name, call.arguments.toString(), lines[j].substring(lines[j].indexOf("(") + 1, lines[j].indexOf(",")), lines[j].substring(lines[j].indexOf(",") + 1, lines[j].length-1),"","","",""], pos: 0, true: 0, false: 0, lineNumber: j.toString()})
              break
            case "endGame":
              this.editorVisual.Endgame.push({title: 'Call', class: 'visualM', id: id, inputs: [call.name, call.arguments.toString(), lines[j].substring(lines[j].indexOf("(") + 1, lines[j].indexOf(",")), lines[j].substring(lines[j].indexOf(",") + 1, lines[j].length-1),"","","",""], pos: 0, true: 0, false: 0, lineNumber: j.toString()})
              break
            case "effect":
              this.editorVisual.Cards[card].effect.push({title: 'Call', class: 'visualM', id: id, inputs: [call.name, call.arguments.toString(), lines[j].substring(lines[j].indexOf("(") + 1, lines[j].indexOf(",")), lines[j].substring(lines[j].indexOf(",") + 1, lines[j].length-1),"","","",""], pos: 0, true: 0, false: 0, lineNumber: j.toString()})
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
          this.editorVisual.PlayersLoops[ifContains].push({title: 'Return', class: 'visualR', id: id, inputs: [input.substring(input.indexOf("n") + 1),"","","","","","",""], pos: 0, true: 0, false: 0, lineNumber: j.toString()})
          break
        case "card":
          this.editorVisual.CardsLoop[ifContains].push({title: 'Return', class: 'visualR', id: id, inputs: [input.substring(input.indexOf("n") + 1),"","","","","","",""], pos: 0, true: 0, false: 0, lineNumber: j.toString()})
          break
        case "endGame":
          this.editorVisual.EndgameLoops[ifContains].push({title: 'Return', class: 'visualR', id: id, inputs: [input.substring(input.indexOf("n") + 1),"","","","","","",""], pos: 0, true: 0, false: 0, lineNumber: j.toString()})
          break
      }
    }
    else
    {
      switch(method)
      {
        case "action":
          this.editorVisual.Players[player].actions[action].push({title: 'Return', class: 'visualR', id: id, inputs: [input.substring(input.indexOf("n") + 1),"","","","","","",""], pos: 0, true: 0, false: 0, lineNumber: j.toString()})
          break
        case "condition":
          switch(parent)
          {
            case "player":
              this.editorVisual.Players[player].conditions[action].push({title: 'Return', class: 'visualR', id: id, inputs: [input.substring(input.indexOf("n") + 1),"","","","","","",""], pos: 0, true: 0, false: 0, lineNumber: j.toString()})
              break
            case "card":
              this.editorVisual.Cards[card].condition.push({title: 'Return', class: 'visualR', id: id, inputs: [input.substring(input.indexOf("n") + 1),"","","","","","",""], pos: 0, true: 0, false: 0, lineNumber: j.toString()})
              break
          }   
          break
        case "turn":
          this.editorVisual.Players[player].turn[0].push({title: 'Return', class: 'visualR', id: id, inputs: [input.substring(input.indexOf("n") + 1),"","","","","","",""], pos: 0, true: 0, false: 0, lineNumber: j.toString()})
          break
        case "endGame":
          this.editorVisual.Endgame.push({title: 'Return', class: 'visualR', id: id, inputs: [input.substring(input.indexOf("n") + 1),"","","","","","",""], pos: 0, true: 0, false: 0, lineNumber: j.toString()})
          break
        case "effect":
          this.editorVisual.Cards[card].effect.push({title: 'Return', class: 'visualR', id: id, inputs: [input.substring(input.indexOf("n") + 1),"","","","","","",""], pos: 0, true: 0, false: 0, lineNumber: j.toString()})
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
          this.editorVisual.Players.push( {name: "", actionNames: [""], actionParams: [""], turnParams: [""], conditionParams: [""], actions: [[{title: '', class: '' , id: '', inputs: ["","","","","","","",""], pos: 0, true: 0, false: 0, lineNumber: j.toString()}]], conditions: [[{title: '', class: '' , id: '', inputs: ["","","","","","","",""], pos: 0, true: 0, false: 0, lineNumber: j.toString()}]], turn: [[{title: '', class: '' , id: '', inputs: ["","","","","","","",""], pos: 0, true: 0, false: 0, lineNumber: j.toString()}]], playerCode: [[{title: '', class: '' , id: '', inputs: ["","","","","","","",""], pos: 0, true: 0, false: 0, lineNumber: j.toString()}]]})
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
          this.editorVisual.Cards.push({name: "", parameter: "",effect: [{title: '', class: '' , id: '', inputs: ["","","","","","","",""], pos: 0, true: 0, false: 0, lineNumber: j.toString()}], condition: [{title: '', class: '' , id: '', inputs: ["","","","","","","",""], pos: 0, true: 0, false: 0, lineNumber: j.toString()}]})
        }
        const l = lines[j].replace(/\s+/,"")
        this.editorVisual.Cards[card].name = l.substring(l.indexOf("d") + 1, l.indexOf("("))
        this.editorVisual.Cards[card].parameter = l.substring(l.indexOf("(") + 1, l.indexOf(")"))
        this.editorVisual.Variables.push({name: this.editorVisual.Cards[card].parameter, value: ""})
        
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
          this.editorVisual.Players[player].actions.push([{title: '', class: '' , id: '', inputs: ["","","","","","","",""], pos: 0, true: 0, false: 0, lineNumber: j.toString()}])
          this.editorVisual.Players[player].conditions.push([{title: '', class: '' , id: '', inputs: ["","","","","","","",""], pos: 0, true: 0, false: 0, lineNumber: j.toString()}])
        }
        this.editorVisual.Players[player].actionNames[action] = l.substring(l.indexOf("n") + 1, l.indexOf("("))
        this.editorVisual.Players[player].actionParams[action] = l.substring(l.indexOf("(") + 1, l.indexOf(")"))
        if(this.editorVisual.Players[player].actionParams[action][0] != null)
        {
          this.editorVisual.Variables.push({name: this.editorVisual.Players[player].actionParams[action][0], value: ""})
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
            this.editorVisual.Properties.push({Property: le[0], Value: le[1], Line: j.toString()})
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
                this.letCreation(l, openIfPlayer, player, action, ifContains[ifContains.length-1].numberOfIf, method, parent , card, j)
              } 
              //Set
              else if (this.editorVisual.Variables.find(vars => vars.name === l[1]) != null  && l[1] != "" || l[1] !== "let" && l[2] == "=" && !lines[j].includes("for"))
              {
                if(l[1] !== "let" && l[2] == "=")
                {
                  this.editorVisual.Variables.push({name: l[1], value: l[2]})
                }
                this.setCreation(lines, j, l, openIfPlayer, ifContains[ifContains.length-1].numberOfIf, player, action, method, parent , card)
              }
              //Output
              else if (l[1] != undefined && l[1].includes('output('))
              {
                this.ioCreation(lines, j, openIfPlayer, ifContains[ifContains.length-1].numberOfIf, player, action, method, "Output", "visualO", parent , card)
              }
              //Input
              else if(l[1] != undefined && l[1].includes('input('))
              {
                this.ioCreation(lines, j, openIfPlayer, ifContains[ifContains.length-1].numberOfIf, player, action, method, "Input", "visualIn", parent , card)         
              }
              //Methods
              else if(l[1] != undefined && this.editorVisual.methods.find(method => method.name === l[1].substring(0, l[1].indexOf("("))))
              {
                this.methodCreation(lines, j, l, openIfPlayer, ifContains[ifContains.length-1].numberOfIf, player, action, method, parent , card)
              }
              //If Statements
              else if(lines[j].includes("if(") || lines[j].includes("if ("))
              {
                const id = this.getEID()
                const params = this.getConditionParams(lines[j])
                this.ifCreation(parent, j)
                if(openIfPlayer > 0 && openInitial > 0)
                {
                  if(createdFor)
                  {
                    this.editorVisual.PlayersLoops[ifContains[ifContains.length-2].numberOfIf].push({title: 'If', class: 'visualIf', id: id, inputs: params, pos: 0,  true: this.editorVisual.playersLoopIndex-1, false: this.editorVisual.playersLoopIndex, lineNumber: j.toString()})
                    createdFor = false
                  }
                  else
                  {
                    this.editorVisual.PlayersLoops[ifContains[ifContains.length-2].numberOfIf].push({title: 'If', class: 'visualIf', id: id, inputs: params, pos: 0,  true: this.editorVisual.playersLoopIndex-1, false: this.editorVisual.playersLoopIndex, lineNumber: j.toString()})
                  }
                  
                }
                else
                {
                  openInitial++
                  this.editorVisual.Players[player].actions[action].push({title: 'If', class: 'visualIf', id: id, inputs: params, pos: 0,  true: this.editorVisual.playersLoopIndex-1, false: this.editorVisual.playersLoopIndex, lineNumber: j.toString()})
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
                  this.editorVisual.PlayersLoops[ifContains[ifContains.length-2].numberOfIf].push({title: 'For', class: 'visualF', id: id, inputs: [loop[0].substring(loop[0].length-1),n.toString(),by.toString(),"","","","",""], pos: this.editorVisual.playersLoopIndex,  true: 0, false: 0, lineNumber: j.toString()})
                }
                else
                {
                  openInitial++
                  this.editorVisual.Players[player].actions[action].push({title: 'For', class: 'visualF', id: id, inputs: [loop[0].substring(loop[0].length-1),n.toString(),by.toString(),"","","","",""], pos: this.editorVisual.playersLoopIndex,  true: 0, false: 0, lineNumber: j.toString()})
                }    
                this.loopCreation(parent, j)
              }
              //Do
              else if(lines[j].includes("do{") || lines[j].includes("do"))
              {
                const id = this.getEID()
                this.editorVisual.playersLoopIndex++
                if(openIfPlayer > 0 && openInitial > 0) 
                { 
                  this.editorVisual.PlayersLoops[ifContains[ifContains.length-2].numberOfIf].push({title: 'doWhile', class: 'visualD', id: id, inputs: ["","","","","","","",""], pos: this.editorVisual.playersLoopIndex,  true: 0, false: 0, lineNumber: j.toString()})
                }
                else
                {
                  openInitial++
                  this.editorVisual.Players[player].actions[action].push({title: 'doWhile', class: 'visualD', id: id, inputs: ["","","","","","","",""], pos: this.editorVisual.playersLoopIndex,  true: 0, false: 0, lineNumber: j.toString()})
                }    
                this.loopCreation(parent, j)
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
                    this.editorVisual.PlayersLoops[ifContains[ifContains.length-2].numberOfIf].push({title: 'While', class: 'visualW', id: id, inputs: params, pos: this.editorVisual.playersLoopIndex,  true: 0, false: 0, lineNumber: j.toString()})
                  }
                  else
                  {
                    openInitial++
                    this.editorVisual.Players[player].actions[action].push({title: 'While', class: 'visualW', id: id, inputs: params, pos: this.editorVisual.playersLoopIndex,  true: 0, false: 0, lineNumber: j.toString()})
                  }    
                  this.loopCreation(parent, j)
                }
              }
            }
          break
        case "condition":
            if(!lines[j].includes("condition") && !lines[j].includes("{") && openCondition != 0)
            {
              const l = lines[j].split(/\s+/)
              //Consider
              if(lines[j].includes("consider:"))
              {
                this.methodCreation(lines, j, l, openIfPlayer, ifContains[ifContains.length-1].numberOfIf, player, action, method, parent , card)
              }
              //Create
              else if(l[1] == "let")
              {
                switch(parent)
                {
                  case "player":
                    this.letCreation(l, openIfPlayer, player, action, ifContains[ifContains.length-1].numberOfIf, method, parent , card, j)
                    break
                  case "card":
                    this.letCreation(l, openIfCard, player, action, ifContains[ifContains.length-1].numberOfIf, method, parent , card, j)
                    break
                } 
              } 
              //Set
              else if (this.editorVisual.Variables.find(vars => vars.name === l[1]) != null  && l[1] != "" || l[1] !== "let" && l[2] == "=" && !lines[j].includes("for"))
              {
                if(l[1] !== "let" && l[2] == "=")
                {
                  this.editorVisual.Variables.push({name: l[1], value: l[2]})
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
              else if (l[1] != undefined && l[1].includes('output('))
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
              else if(l[1] != undefined && l[1].includes('input('))
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
              else if(l[1] != undefined && this.editorVisual.methods.find(method => method.name === l[1].substring(0, l[1].indexOf("("))))
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
                this.ifCreation(parent, j)
                switch(parent)
                {
                  case "player":
                    if(openIfPlayer > 0 && openInitial > 0)
                    {
                      if(createdFor)
                      {
                        this.editorVisual.PlayersLoops[ifContains[ifContains.length-2].numberOfIf].push({title: 'If', class: 'visualIf', id: id, inputs: params, pos: 0,  true: this.editorVisual.playersLoopIndex-1, false: this.editorVisual.playersLoopIndex, lineNumber: j.toString()})
                        createdFor = false
                      }
                      else
                      {
                        this.editorVisual.PlayersLoops[ifContains[ifContains.length-2].numberOfIf].push({title: 'If', class: 'visualIf', id: id, inputs: params, pos: 0,  true: this.editorVisual.playersLoopIndex-1, false: this.editorVisual.playersLoopIndex, lineNumber: j.toString()})
                      }
                    }
                    else
                    {
                      openInitial++
                      this.editorVisual.Players[player].conditions[action].push({title: 'If', class: 'visualIf', id: id, inputs: params, pos: 0,  true: this.editorVisual.playersLoopIndex-1, false: this.editorVisual.playersLoopIndex, lineNumber: j.toString()}) 
                      createdFor = false
                    }
                    break
                  case "card":
                    if(openIfCard > 0 && openInitial > 0)
                    {
                      if(createdFor)
                      {
                        this.editorVisual.CardsLoop[ifContains[ifContains.length-2].numberOfIf].push({title: 'If', class: 'visualIf', id: id, inputs: params, pos: 0,  true: this.editorVisual.cardsLoopIndex-1, false: this.editorVisual.cardsLoopIndex, lineNumber: j.toString()})
                        createdFor = false
                      }
                      else
                      {
                        this.editorVisual.CardsLoop[ifContains[ifContains.length-2].numberOfIf].push({title: 'If', class: 'visualIf', id: id, inputs: params, pos: 0,  true: this.editorVisual.cardsLoopIndex-1, false: this.editorVisual.cardsLoopIndex, lineNumber: j.toString()})
                      }
                    }
                    else
                    {
                      openInitial++
                      this.editorVisual.Cards[card].condition.push({title: 'If', class: 'visualIf', id: id, inputs: params, pos: 0,  true: this.editorVisual.cardsLoopIndex-1, false: this.editorVisual.cardsLoopIndex, lineNumber: j.toString()})
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
                      this.editorVisual.PlayersLoops[ifContains[ifContains.length-2].numberOfIf].push({title: 'For', class: 'visualF', id: id, inputs: [loop[0].substring(loop[0].length-1),n.toString(),by.toString(),"","","","",""], pos: this.editorVisual.playersLoopIndex,  true: 0, false: 0, lineNumber: j.toString()})
                    }
                    else
                    {
                      openInitial++
                      this.editorVisual.Players[player].conditions[action].push({title: 'For', class: 'visualF', id: id, inputs: [loop[0].substring(loop[0].length-1),n.toString(),by.toString(),"","","","",""], pos: this.editorVisual.playersLoopIndex,  true: 0, false: 0, lineNumber: j.toString()})
                    }    
                    this.loopCreation(parent, j)
                    break
                  case "card":
                    this.editorVisual.cardsLoopIndex++
                    if(openIfCard > 0 && openInitial > 0) 
                    {
                      this.editorVisual.CardsLoop[ifContains[ifContains.length-2].numberOfIf].push({title: 'For', class: 'visualF', id: id, inputs: [loop[0].substring(loop[0].length-1),n.toString(),by.toString(),"","","","",""], pos: this.editorVisual.cardsLoopIndex,  true: 0, false: 0, lineNumber: j.toString()})
                    }
                    else
                    {
                      openInitial++
                      this.editorVisual.Cards[card].condition.push({title: 'For', class: 'visualF', id: id, inputs: [loop[0].substring(loop[0].length-1),n.toString(),by.toString(),"","","","",""], pos: this.editorVisual.cardsLoopIndex,  true: 0, false: 0, lineNumber: j.toString()})
                    }    
                    this.loopCreation(parent, j)
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
                      this.editorVisual.PlayersLoops[ifContains[ifContains.length-2].numberOfIf].push({title: 'doWhile', class: 'visualD', id: id, inputs: ["","","","","","","",""], pos: this.editorVisual.playersLoopIndex,  true: 0, false: 0, lineNumber: j.toString()})  
                    }
                    else
                    {
                      openInitial++
                      this.editorVisual.Players[player].conditions[action].push({title: 'doWhile', class: 'visualD', id: id, inputs: ["","","","","","","",""], pos: this.editorVisual.playersLoopIndex,  true: 0, false: 0, lineNumber: j.toString()})
                    }    
                    this.loopCreation(parent, j)
                    break
                  case "card":
                    this.editorVisual.cardsLoopIndex++
                    if(openIfCard > 0 && openInitial > 0) 
                    { 
                      this.editorVisual.CardsLoop[ifContains[ifContains.length-2].numberOfIf].push({title: 'doWhile', class: 'visualD', id: id, inputs: ["","","","","","","",""], pos: this.editorVisual.cardsLoopIndex,  true: 0, false: 0, lineNumber: j.toString()})
                    }
                    else
                    {
                      openInitial++
                      this.editorVisual.Cards[card].condition.push({title: 'doWhile', class: 'visualD', id: id, inputs: ["","","","","","","",""], pos: this.editorVisual.cardsLoopIndex,  true: 0, false: 0, lineNumber: j.toString()})
                    }    
                    this.loopCreation(parent, j)
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
                        this.editorVisual.PlayersLoops[ifContains[ifContains.length-2].numberOfIf].push({title: 'While', class: 'visualW', id: id, inputs: params, pos: this.editorVisual.playersLoopIndex,  true: 0, false: 0, lineNumber: j.toString()})
                      }
                      else
                      {
                        openInitial++
                        this.editorVisual.Players[player].conditions[action].push({title: 'While', class: 'visualW', id: id, inputs: params, pos: this.editorVisual.playersLoopIndex,  true: 0, false: 0, lineNumber: j.toString()})
                      }    
                      this.loopCreation(parent, j)
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
                        this.editorVisual.CardsLoop[ifContains[ifContains.length-2].numberOfIf].push({title: 'While', class: 'visualW', id: id, inputs: params, pos: this.editorVisual.cardsLoopIndex,  true: 0, false: 0, lineNumber: j.toString()})
                      }
                      else
                      {
                        openInitial++
                        this.editorVisual.Cards[card].condition.push({title: 'While', class: 'visualW', id: id, inputs: params, pos: this.editorVisual.cardsLoopIndex,  true: 0, false: 0, lineNumber: j.toString()})
                      }    
                      this.loopCreation(parent, j)
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
              this.letCreation(l, openIfPlayer, player, action, ifContains[ifContains.length-1].numberOfIf, method, parent , card, j)
            } 
            //Set
            else if (this.editorVisual.Variables.find(vars => vars.name === l[1]) != null && l[1] != "" || l[1] !== "let" && l[2] == "="  && !lines[j].includes("for"))
            {
              if(l[1] !== "let" && l[2] == "=")
              {
                this.editorVisual.Variables.push({name: l[1], value: l[2]})
              }
              this.setCreation(lines, j, l, openIfPlayer, ifContains[ifContains.length-1].numberOfIf, player, action, method, parent , card)
            }
            //Output
            else if (l[1] != undefined && l[1].includes('output('))
            {
              this.ioCreation(lines, j, openIfPlayer, ifContains[ifContains.length-1].numberOfIf, player, action, method, "Output", "visualO", parent , card)
            }
            //Input
            else if( l[1] != undefined && l[1].includes('input('))
            {
              this.ioCreation(lines, j, openIfPlayer, ifContains[ifContains.length-1].numberOfIf, player, action, method, "Input", "visualIn", parent , card)         
            }
            //Methods
            else if(l[1] != undefined && this.editorVisual.methods.find(method => method.name === l[1].substring(0, l[1].indexOf("("))))
            {
              this.methodCreation(lines, j, l, openIfPlayer, ifContains[ifContains.length-1].numberOfIf, player, action, method, parent , card)
            }
            //If Statements
            else if(lines[j].includes("if(") || lines[j].includes("if ("))
            {
              const id = this.getEID()
              const params = this.getConditionParams(lines[j])
              this.ifCreation(parent, j)
              if(openIfPlayer > 0 && openInitial > 0)
              {
                if(createdFor)
                {
                  this.editorVisual.PlayersLoops[ifContains[ifContains.length-2].numberOfIf].push({title: 'If', class: 'visualIf', id: id, inputs: params, pos: 0,  true: this.editorVisual.playersLoopIndex-1, false: this.editorVisual.playersLoopIndex, lineNumber: j.toString()})
                  createdFor = false
                }
                else
                {
                  this.editorVisual.PlayersLoops[ifContains[ifContains.length-2].numberOfIf].push({title: 'If', class: 'visualIf', id: id, inputs: params, pos: 0,  true: this.editorVisual.playersLoopIndex-1, false: this.editorVisual.playersLoopIndex, lineNumber: j.toString()})
                }
                
              }
              else
              {
                openInitial++
                this.editorVisual.Players[player].turn[0].push({title: 'If', class: 'visualIf', id: id, inputs: params, pos: 0,  true: this.editorVisual.playersLoopIndex-1, false: this.editorVisual.playersLoopIndex, lineNumber: j.toString()})
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
                this.editorVisual.PlayersLoops[ifContains[ifContains.length-2].numberOfIf].push({title: 'For', class: 'visualF', id: id, inputs: [loop[0].substring(loop[0].length-1),n.toString(),by.toString(),"","","","",""], pos: this.editorVisual.playersLoopIndex,  true: 0, false: 0, lineNumber: j.toString()})
              }
              else
              {
                openInitial++
                this.editorVisual.Players[player].turn[0].push({title: 'For', class: 'visualF', id: id, inputs: [loop[0].substring(loop[0].length-1),n.toString(),by.toString(),"","","","",""], pos: this.editorVisual.playersLoopIndex,  true: 0, false: 0, lineNumber: j.toString()})
              }    
              this.loopCreation(parent, j)
            }
            //Do
            else if(lines[j].includes("do{") || lines[j].includes("do"))
            {
              const id = this.getEID()
              this.editorVisual.playersLoopIndex++
              if(openIfPlayer > 0 && openInitial > 0) 
              { 
                this.editorVisual.PlayersLoops[ifContains[ifContains.length-2].numberOfIf].push({title: 'doWhile', class: 'visualD', id: id, inputs: ["","","","","","","",""], pos: this.editorVisual.playersLoopIndex,  true: 0, false: 0, lineNumber: j.toString()})
              }
              else
              {
                openInitial++
                this.editorVisual.Players[player].turn[0].push({title: 'doWhile', class: 'visualD', id: id, inputs: ["","","","","","","",""], pos: this.editorVisual.playersLoopIndex,  true: 0, false: 0, lineNumber: j.toString()})
              }    
              this.loopCreation(parent, j)
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
                  this.editorVisual.PlayersLoops[ifContains[ifContains.length-2].numberOfIf].push({title: 'While', class: 'visualW', id: id, inputs: params, pos: this.editorVisual.playersLoopIndex,  true: 0, false: 0, lineNumber: j.toString()})
                }
                else
                {
                  openInitial++
                  this.editorVisual.Players[player].turn[0].push({title: 'While', class: 'visualW', id: id, inputs: params, pos: this.editorVisual.playersLoopIndex,  true: 0, false: 0, lineNumber: j.toString()})
                }    
                this.loopCreation(parent, j)
              }
            }
          }
          break
        case "playerCodeArea":
          if(playerCodeArea != 0)
          {
            const l = lines[j].split(/\s+/)
            //Set
            if (this.editorVisual.Variables.find(vars => vars.name === l[1]) != null || l[1] !== "let" && l[2] == "="  && !lines[j].includes("for"))
            {
              if(l[1] !== "let" && l[2] == "=")
              {
                this.editorVisual.Variables.push({name: l[1], value: l[2]})
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
              this.letCreation(l, openIfCard, player, action, ifContains[ifContains.length-1].numberOfIf, method, parent , card, j)
            } 
            //Set
            else if (this.editorVisual.Variables.find(vars => vars.name === l[1]) != null && l[1] != "" || l[1] !== "let" && l[2] == "="  && !lines[j].includes("for"))
            {
              if(l[1] !== "let" && l[2] == "=")
              {
                this.editorVisual.Variables.push({name: l[1], value: l[2]})
              }
              this.setCreation(lines, j, l, openIfCard, ifContains[ifContains.length-1].numberOfIf, player, action, method, parent , card)
            }
            //Output
            else if (l[1] != undefined && l[1].includes('output('))
            {
              this.ioCreation(lines, j, openIfCard, ifContains[ifContains.length-1].numberOfIf, player, action, method, "Output", "visualO", parent , card)
            }
            //Input
            else if(l[1] != undefined && l[1].includes('input('))
            {
              this.ioCreation(lines, j, openIfCard, ifContains[ifContains.length-1].numberOfIf, player, action, method, "Input", "visualIn", parent , card)         
            }
            //Methods
            else if(l[1] != undefined && this.editorVisual.methods.find(method => method.name === l[1].substring(0, l[1].indexOf("("))))
            {
              this.methodCreation(lines, j, l, openIfCard, ifContains[ifContains.length-1].numberOfIf, player, action, method, parent , card)
            }
            //If Statements
            else if(lines[j].includes("if(") || lines[j].includes("if ("))
            {
              const id = this.getEID()
              const params = this.getConditionParams(lines[j])
              this.ifCreation(parent, j)
              if(openIfCard > 0 && openInitial > 0)
              {
                if(createdFor)
                {
                  this.editorVisual.CardsLoop[ifContains[ifContains.length-2].numberOfIf].push({title: 'If', class: 'visualIf', id: id, inputs: params, pos: 0,  true: this.editorVisual.cardsLoopIndex-1, false: this.editorVisual.playersLoopIndex, lineNumber: j.toString()})
                  createdFor = false
                }
                else
                {
                  this.editorVisual.CardsLoop[ifContains[ifContains.length-2].numberOfIf].push({title: 'If', class: 'visualIf', id: id, inputs: params, pos: 0,  true: this.editorVisual.cardsLoopIndex-1, false: this.editorVisual.playersLoopIndex, lineNumber: j.toString()})
                }
                
              }
              else
              {
                openInitial++
                this.editorVisual.Cards[card].effect.push({title: 'If', class: 'visualIf', id: id, inputs: params, pos: 0,  true: this.editorVisual.cardsLoopIndex-1, false: this.editorVisual.cardsLoopIndex, lineNumber: j.toString()})
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
                this.editorVisual.CardsLoop[ifContains[ifContains.length-2].numberOfIf].push({title: 'For', class: 'visualF', id: id, inputs: [loop[0].substring(loop[0].length-1),n.toString(),by.toString(),"","","","",""], pos: this.editorVisual.cardsLoopIndex,  true: 0, false: 0, lineNumber: j.toString()})
              }
              else
              {
                openInitial++
                this.editorVisual.Cards[card].effect.push({title: 'For', class: 'visualF', id: id, inputs: [loop[0].substring(loop[0].length-1),n.toString(),by.toString(),"","","","",""], pos: this.editorVisual.cardsLoopIndex,  true: 0, false: 0, lineNumber: j.toString()})
              }    
              this.loopCreation(parent, j)
            }
            //Do
            else if(lines[j].includes("do{") || lines[j].includes("do"))
            {
              const id = this.getEID()
              this.editorVisual.cardsLoopIndex++
              if(openIfCard > 0 && openInitial > 0) 
              { 
                this.editorVisual.CardsLoop[ifContains[ifContains.length-2].numberOfIf].push({title: 'doWhile', class: 'visualD', id: id, inputs: ["","","","","","","",""], pos: this.editorVisual.cardsLoopIndex,  true: 0, false: 0, lineNumber: j.toString()})
              }
              else
              {
                openInitial++
                this.editorVisual.Cards[card].effect.push({title: 'doWhile', class: 'visualD', id: id, inputs: ["","","","","","","",""], pos: this.editorVisual.cardsLoopIndex,  true: 0, false: 0, lineNumber: j.toString()})
              }    
              this.loopCreation(parent, j)
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
                  this.editorVisual.CardsLoop[ifContains[ifContains.length-2].numberOfIf].push({title: 'While', class: 'visualW', id: id, inputs: params, pos: this.editorVisual.cardsLoopIndex,  true: 0, false: 0, lineNumber: j.toString()})
                }
                else
                {
                  openInitial++
                  this.editorVisual.Cards[card].effect.push({title: 'While', class: 'visualW', id: id, inputs: params, pos: this.editorVisual.cardsLoopIndex,  true: 0, false: 0, lineNumber: j.toString()})
                }    
                this.loopCreation(parent, j)
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
              this.letCreation(l, openIfEndGame, player, action, ifContains[ifContains.length-1].numberOfIf, method, parent , card, j)
            } 
            //Set
            else if (this.editorVisual.Variables.find(vars => vars.name === l[1]) != null && l[1] != "" || l[1] !== "let" && l[2] === "="  && !lines[j].includes("for"))
            {
              if(l[1] !== "let" && l[2] == "=")
              {
                this.editorVisual.Variables.push({name: l[1], value: l[2]})
              }
              this.setCreation(lines, j, l, openIfEndGame, ifContains[ifContains.length-1].numberOfIf, player, action, method, parent , card)
            }
            //Output
            else if (l[1] != undefined && l[1].includes('output('))
            {
              this.ioCreation(lines, j, openIfEndGame, ifContains[ifContains.length-1].numberOfIf, player, action, method, "Output", "visualO", parent , card)
            }
            //Input
            else if(l[1] != undefined && l[1].includes('input('))
            {
              this.ioCreation(lines, j, openIfEndGame, ifContains[ifContains.length-1].numberOfIf, player, action, method, "Input", "visualIn", parent , card)         
            }
            //Methods
            else if(l[1] != undefined && this.editorVisual.methods.find(method => method.name === l[1].substring(0, l[1].indexOf("("))))
            {
              this.methodCreation(lines, j, l, openIfEndGame, ifContains[ifContains.length-1].numberOfIf, player, action, method, parent , card)
            }
            //If Statements
            else if(lines[j].includes("if(") || lines[j].includes("if ("))
            {
              const id = this.getEID()
              const params = this.getConditionParams(lines[j])
              this.ifCreation(parent, j)
              if(openIfEndGame > 0 && openInitial > 0)
              {
                if(createdFor)
                {
                  this.editorVisual.EndgameLoops[ifContains[ifContains.length-2].numberOfIf].push({title: 'If', class: 'visualIf', id: id, inputs: params, pos: 0,  true: this.editorVisual.endLoopIndex-1, false: this.editorVisual.endLoopIndex, lineNumber: j.toString()})
                  createdFor = false
                }
                else
                {
                  this.editorVisual.EndgameLoops[ifContains[ifContains.length-2].numberOfIf].push({title: 'If', class: 'visualIf', id: id, inputs: params, pos: 0,  true: this.editorVisual.endLoopIndex-1, false: this.editorVisual.endLoopIndex, lineNumber: j.toString()})
                }
                
              }
              else
              {
                openInitial++
                this.editorVisual.Endgame.push({title: 'If', class: 'visualIf', id: id, inputs: params, pos: 0,  true: this.editorVisual.endLoopIndex-1, false: this.editorVisual.endLoopIndex, lineNumber: j.toString()})
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
                this.editorVisual.EndgameLoops[ifContains[ifContains.length-2].numberOfIf].push({title: 'For', class: 'visualF', id: id, inputs: [loop[0].substring(loop[0].length-1),n.toString(),by.toString(),"","","","",""], pos: this.editorVisual.endLoopIndex,  true: 0, false: 0, lineNumber: j.toString()})
              }
              else
              {
                openInitial++
                this.editorVisual.Endgame.push({title: 'For', class: 'visualF', id: id, inputs: [loop[0].substring(loop[0].length-1),n.toString(),by.toString(),"","","","",""], pos: this.editorVisual.endLoopIndex,  true: 0, false: 0, lineNumber: j.toString()})
              }    
              this.loopCreation(parent, j)
            }
            //Do
            else if(lines[j].includes("do{") || lines[j].includes("do"))
            {
              const id = this.getEID()
              this.editorVisual.endLoopIndex++
              if(openIfEndGame > 0 && openInitial > 0) 
              { 
                this.editorVisual.EndgameLoops[ifContains[ifContains.length-2].numberOfIf].push({title: 'doWhile', class: 'visualD', id: id, inputs: ["","","","","","","",""], pos: this.editorVisual.endLoopIndex,  true: 0, false: 0, lineNumber: j.toString()})
              }
              else
              {
                openInitial++
                this.editorVisual.Endgame.push({title: 'doWhile', class: 'visualD', id: id, inputs: ["","","","","","","",""], pos: this.editorVisual.endLoopIndex,  true: 0, false: 0, lineNumber: j.toString()})
              }    
              this.loopCreation(parent, j)
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
                  this.editorVisual.EndgameLoops[ifContains[ifContains.length-2].numberOfIf].push({title: 'While', class: 'visualW', id: id, inputs: params, pos: this.editorVisual.endLoopIndex,  true: 0, false: 0, lineNumber: j.toString()})
                }
                else
                {
                  openInitial++
                  this.editorVisual.Endgame.push({title: 'While', class: 'visualW', id: id, inputs: params, pos: this.editorVisual.endLoopIndex,  true: 0, false: 0, lineNumber: j.toString()})
                }    
                this.loopCreation(parent, j)
              }
            }
          }
          break
      }
    }
  }

}
