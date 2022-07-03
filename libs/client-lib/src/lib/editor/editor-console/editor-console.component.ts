import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';


@Component({
  selector: 'board-game-companion-app-editor-console',
  templateUrl: './editor-console.component.html',
  styleUrls: ['./editor-console.component.scss'],
})
export class EditorConsoleComponent implements OnInit{
  @Input() height = 0;
  @Input() width = 0;
  @Input() margin = 0;
  @Input() bottom = 0;
  @Output() changeHeightEvent = new EventEmitter<number>();
  show = true;

  messages:string[] = [];
  
  ngOnInit(): void {
    console.log("editor-tool-bar");   
  }

  reduceHeight(): void{
    if(this.height > 40)
      this.height -= 10;
    else
      this.close();
      
    this.changeHeightEvent.emit(this.height);
  }

  increaseHeight(): void{
    if(this.height < 200)
      this.height += 10;

    this.changeHeightEvent.emit(this.height);
  }

  open(): void{
    this.show = true;
    this.height = 150;
    this.changeHeightEvent.emit(this.height);
  }

  close(): void{
    this.show = false;
    this.height = 0;
    this.changeHeightEvent.emit(this.height);
  }

  print(message:string){
    this.messages.push(message);
  }

  clear(){
    this.messages = [];
  }

  defineConsole(): any{
    const console = (function (windowConsole:any,editorConsole:EditorConsoleComponent){
      return {
        log: function(text:string){
          windowConsole.log(text);
          editorConsole.print(text);
        },
        info: function(strInfo:string){
          windowConsole.info(strInfo);
        },
        warn: function(strWarn:string){
          windowConsole.warn(strWarn);
        },
        error: function(strError:string){
          windowConsole.error(strError);
        },
        print: function(message:string){
          editorConsole.print(message);      
        }
      }
    })(window.console,this);

    return console;
  }

}
