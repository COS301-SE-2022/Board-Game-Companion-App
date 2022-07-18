import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import * as ace from "ace-builds";
import { find } from '../../shared/models/find';
import { replace } from '../../shared/models/replace';

@Component({
  selector: 'board-game-companion-app-editor-tool-bar',
  templateUrl: './editor-tool-bar.component.html',
  styleUrls: ['./editor-tool-bar.component.scss'],
})
export class EditorToolBarComponent implements OnInit{
  @Input() height = 0;
  @Output() executeEvent = new EventEmitter();
  @Output() themeEvent = new EventEmitter();
  @Output() undoEvent = new EventEmitter();
  @Output() redoEvent = new EventEmitter();
  @Output() copyEvent = new EventEmitter();
  @Output() cutEvent = new EventEmitter();
  @Output() pasteEvent = new EventEmitter();
  @Output() findEvent = new EventEmitter<find>();
  @Output() replaceEvent = new EventEmitter<replace>();
  @Output() findNextEvent = new EventEmitter();
  @Output() findPreviousEvent = new EventEmitter();
  @Output() replaceAllEvent = new EventEmitter<replace>();
  @Output() toggleSideBarEvent = new EventEmitter<boolean>();
  @Output() toggleConsoleEvent = new EventEmitter<boolean>();
  showReplace = false;
  caseSensitive = false;
  wrap = true;
  regEx = false;
  wholeWord = false;
  findText = "";
  replaceWithText = "";
  themes:string[] = ["Ambiance","Chaos","Clouds_Midnight","Chrome","Clouds","Cobalt","Crimson_Editor","Dawn","Dracula","Dreamweaver","Eclipse","GitHub","GOB","Gruvbox","idle_Fingers","IPlastic","KatzenMilch","kr_Theme","Kuroir","Merbivore","Merbivore_Soft","Mono_Industrial","Monokai","Nord_Dark","One_Dark","Pastel_on_dark","Solarized_Dark","Solarized_Light","SQLServer","Terminal","TextMate","Tomorrow","Tomorrow_Night","Tomorrow_Night_Blue","Tomorrow_Night_Bright","Tomorrow_Night_Eighties","Twilight","Vibrant_Ink","XCode"];
  selection = "";
  sideBar = true;
  console = true;

  ngOnInit(): void {
    console.log("edit-tool-bar");
  }

  toggleSideBar(): void{
    this.sideBar = !this.sideBar;
    this.toggleSideBarEvent.emit(this.sideBar);
  }

  toggleConsole(): void{
    this.console = !this.console;
    this.toggleConsoleEvent.emit(this.console);
  }

  execute(): void {
    this.executeEvent.emit();
  };

  select(val:string) {
    this.selection = val;
  }

  apply(): void {
    localStorage.setItem("board-game-companion-script-editor-theme",this.selection);
    this.themeEvent.emit();
    document.getElementById("cancel-save-theme")?.click();
  }

  undo(): void{
    this.undoEvent.emit();
  }

  redo(): void{
    this.redoEvent.emit();
  }

  copy(): void{
    this.copyEvent.emit();
  }

  cut(): void{
    this.cutEvent.emit();
  }

  paste(): void{
    this.pasteEvent.emit();
  }

  findClick(): void{
    this.findText = "";
    this.showReplace = false;
  }

  replaceClick(): void{
    this.findText = "";
    this.replaceWithText = "";
    this.showReplace = true;
    //alert(this.showReplace);
  }

  find(): void{
    const find:find = {
      caseSensitive: this.caseSensitive,
      regularExpression: this.regEx,
      wholeWord: this.wholeWord,
      wrap: this.wrap,
      text: this.findText
    }

    this.findEvent.emit(find);
  }

  findNext(): void{
    this.findNextEvent.emit();
  }

  findPrevious(): void{
    this.findPreviousEvent.emit();
  }

  replace(): void{
    const replace:replace = {
      caseSensitive: this.caseSensitive,
      regularExpression: this.regEx,
      wholeWord: this.wholeWord,
      wrap: this.wrap,
      text: this.findText,
      replace: this.replaceWithText
    }

    this.replaceEvent.emit(replace);
  }

  replaceAll(): void{
    const replace:replace = {
      caseSensitive: this.caseSensitive,
      regularExpression: this.regEx,
      wholeWord: this.wholeWord,
      wrap: this.wrap,
      text: this.findText,
      replace: this.replaceWithText
    }
    this.replaceAllEvent.emit(replace);
  }

  initialiseThemes():void{
    let editor:any;
    const theme = localStorage.getItem("board-game-companion-script-editor-theme");
    const value = "function print(){\n\tconsole.log('Hello World');\n}\n\nprint();\n";
    
    this.selection = theme == null ? "Dracula" : theme;

    for(let count = 0; count < this.themes.length; count++){
      editor = ace.edit(this.themes[count]); 
      editor.setTheme("ace/theme/" + this.themes[count].toLowerCase());
      editor.resize();
      editor.setValue(value, -1);
      editor.session.setMode("ace/mode/javascript");
      editor.setOptions({
        fontFamily: 'monospace',
        fontSize: '8pt',
        enableLiveAutocompletion: true
      });
    }
  }

}
