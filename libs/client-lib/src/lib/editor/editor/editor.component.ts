import { Component, OnInit, HostListener, ViewChild  } from '@angular/core';
import { EditorBodyComponent } from '../editor-body/editor-body.component';
import { EditorConsoleComponent } from '../editor-console/editor-console.component';

interface message{
  message: string;
  class: string;
}

@Component({
  selector: 'board-game-companion-app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss'],
})
export class EditorComponent implements OnInit{
  toolBarHeight = 35;
  sideBarWidth = 180;
  sideBarHeight = 0;
  statusBarHeight = 20;
  screenWidth = 0;
  screenHeight = 0;
  consoleWidth = 0;
  consoleHeight = 150;
  bodyHeight = 0;
  bodyWidth = 0;
  messages:message[] = [];
  @ViewChild(EditorBodyComponent,{static:true}) editorCode: EditorBodyComponent = new EditorBodyComponent();
  @ViewChild(EditorConsoleComponent,{static:true}) editorConsole: EditorConsoleComponent = new EditorConsoleComponent();

  ngOnInit(): void {
    console.log("editor");
    this.screenWidth = window.innerWidth;
    this.screenHeight = window.innerHeight;
    this.updateDimensions();  
  }

  @HostListener('window:resize', ['$event'])
  onScreenResize(): void{
    this.screenWidth = window.innerWidth;
    this.screenHeight = window.innerHeight;
    this.updateDimensions();
  }

  updateDimensions(): void{
    this.sideBarHeight = this.screenHeight - this.toolBarHeight - this.statusBarHeight;
    this.consoleWidth = this.screenWidth - this.sideBarWidth;
    this.bodyHeight = this.screenHeight - this.toolBarHeight - this.statusBarHeight - this.consoleHeight;
    this.bodyWidth = this.screenWidth - this.sideBarWidth;
  }

  updateConsoleHeight(height:number):void{
    this.consoleHeight = height;
    this.updateDimensions();
  }

  changeTheme():void{
    const theme = localStorage.getItem("board-game-companion-script-editor-theme");

    if(theme !== null)
      this.editorCode.codeEditor.setTheme("ace/theme/" + theme.toLowerCase());
  }

  execute(): void{
    
    this.editorConsole.open();
    try{
      const console = this.editorConsole.defineConsole();

      const code = new Function("console",this.editorCode.getCode());
      code(console);
    }catch(err){
      console.log(err);
    }
  }

  toggleSideBar(): void{
    this.sideBarWidth =  this.sideBarWidth == 20 ? 100 : 20;
    this.updateDimensions();    
  }

}
