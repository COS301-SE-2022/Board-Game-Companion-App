import { Component, Input, OnInit, Output, EventEmitter, AfterViewInit } from '@angular/core';
import * as ace from "ace-builds";

@Component({
  selector: 'board-game-companion-app-editor-theme',
  templateUrl: './editor-theme.component.html',
  styleUrls: ['./editor-theme.component.scss'],
})
export class EditorThemeComponent implements OnInit,AfterViewInit{
  themes:string[] = ["Ambiance","Chaos","Clouds_Midnight","Chrome","Clouds","Cobalt","Crimson_Editor","Dawn","Dracula","Dreamweaver","Eclipse","GitHub","GOB","Gruvbox","idle_Fingers","IPlastic","KatzenMilch","kr_Theme","Kuroir","Merbivore","Merbivore_Soft","Mono_Industrial","Monokai","Nord_Dark","One_Dark","Pastel_on_dark","Solarized_Dark","Solarized_Light","SQLServer","Terminal","TextMate","Tomorrow","Tomorrow_Night","Tomorrow_Night_Blue","Tomorrow_Night_Bright","Tomorrow_Night_Eighties","Twilight","Vibrant_Ink","XCode"];
  selection = "";
  @Output() themeEvent = new EventEmitter();

  ngOnInit(): void {
    const theme = localStorage.getItem("board-game-companion-script-editor-theme");
    this.selection = theme == null ? "Dracula" : theme;
  }

  ngAfterViewInit(): void {
    this.initialiseThemes();
  }

  select(val:string) {
    this.selection = val;
  }

  initialiseThemes():void{
    let editor:any;
    
    const value = "function print(){\n\tconsole.log('Hello World');\n}\n\nprint();\n";
  

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

  apply(): void {
    localStorage.setItem("board-game-companion-script-editor-theme",this.selection);
    this.themeEvent.emit();
    document.getElementById("cancel-save-theme")?.click();
  }

}
