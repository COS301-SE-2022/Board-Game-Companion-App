import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import * as ace from "ace-builds";

@Component({
  selector: 'board-game-companion-app-editor-tool-bar',
  templateUrl: './editor-tool-bar.component.html',
  styleUrls: ['./editor-tool-bar.component.scss'],
})
export class EditorToolBarComponent implements OnInit{
  constructor(private readonly router: Router) {

  }
  @Input() height = 0;
  @Output() executeEvent = new EventEmitter();
  @Output() themeEvent = new EventEmitter();
  @Output() undoEvent = new EventEmitter();
  @Output() redoEvent = new EventEmitter();
  @Output() copyEvent = new EventEmitter();
  @Output() cutEvent = new EventEmitter();
  @Output() pasteEvent = new EventEmitter();
  @Output() showFindEvent = new EventEmitter();
  @Output() showReplaceEvent = new EventEmitter();
  showReplace = false;
  themes:string[] = ["Ambiance","Chaos","Clouds_Midnight","Chrome","Clouds","Cobalt","Crimson_Editor","Dawn","Dracula","Dreamweaver","Eclipse","GitHub","GOB","Gruvbox","idle_Fingers","IPlastic","KatzenMilch","kr_Theme","Kuroir","Merbivore","Merbivore_Soft","Mono_Industrial","Monokai","Nord_Dark","One_Dark","Pastel_on_dark","Solarized_Dark","Solarized_Light","SQLServer","Terminal","TextMate","Tomorrow","Tomorrow_Night","Tomorrow_Night_Blue","Tomorrow_Night_Bright","Tomorrow_Night_Eighties","Twilight","Vibrant_Ink","XCode"];
  selection = "";

  

  ngOnInit(): void {
    console.log("edit-tool-bar");
  }

  execute(): void {
    this.executeEvent.emit();
  };

  select(val:string) {
    this.selection = val;
  }

  moveTo(path:string):void{
    if(path == "home")
    {
      this.router.navigate(['/script-detail']);
    }
    
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
    this.showReplace = false;
    alert(false)
  }

  replaceClick(): void{
    this.showReplace = true;
    alert(true)
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
