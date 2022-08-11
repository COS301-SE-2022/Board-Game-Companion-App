import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';


interface message{
  output: boolean;
  outputMessage: string;
}

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
  inputBlock = false;
  inputCounter = 0;
  beep = false;
  beepInterval = 0;
  inputId = "";

  messages:message[] = [];
  
  ngOnInit(): void {
    this.inputId = ""   
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

  print(message:message){
    this.messages.push(message);
  }

  clear(){
    this.messages = [];
  }

  saveInput(value:any){

    if(value.key === "Enter"){
      value?.preventDefault();
      this.inputBlock = false;
      const input:HTMLInputElement = document.getElementById(this.inputId) as HTMLInputElement;
      input.disabled = true;
      clearInterval(this.beepInterval);
      this.beep = false;
    }
  }

  defineConsole(): any{
    const console = (function (windowConsole:any,editorConsole:EditorConsoleComponent){
      return {
        log: (text:string)=>{
          windowConsole.log(text);
        },
        info: (strInfo:string)=>{
          windowConsole.info(strInfo);
        },
        warn: (strWarn:string)=>{
          windowConsole.warn(strWarn);
        },
        error: (strError:string)=>{
        
          windowConsole.error(strError);
        },
        print: (text:string)=>{
          editorConsole.print({output:true,outputMessage:text});      
        },
        input: async ()=>{
          editorConsole.inputId = "console-input-box-" + editorConsole.inputCounter.toString();
          editorConsole.print({output:false,outputMessage:editorConsole.inputId});
          
          editorConsole.inputCounter++;
          editorConsole.beepInterval = window.setInterval(()=>{
            editorConsole.beep = !editorConsole.beep;
          },500);
          editorConsole.inputBlock = true;
          
          const pause = new Promise((resolve)=>{
            const interval = setInterval(()=>{
                if(!editorConsole.inputBlock){
                    clearInterval(interval);
                    resolve("Okay");
                }
            },10);
          });

          await pause;
          
          const input:HTMLInputElement = document.getElementById(editorConsole.inputId) as HTMLInputElement;
          return input.value;
        },
        clear: function(){
          editorConsole.clear();
        }
      }
    })(window.console,this);

    return console;
  }

}
