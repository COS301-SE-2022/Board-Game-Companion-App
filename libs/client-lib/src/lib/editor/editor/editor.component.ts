import { Component, OnInit, HostListener, ViewChild } from '@angular/core';
import { EditorBodyComponent } from '../editor-body/editor-body.component';
import { EditorConsoleComponent } from '../editor-console/editor-console.component';
import { EditorStatusBarComponent } from '../editor-status-bar/editor-status-bar.component';
import { empty, script } from '../../shared/models/script';
import { ScriptService } from '../../shared/services/scripts/script.service';
import { ActivatedRoute, Router } from '@angular/router';
import { find } from '../../shared/models/find';
import { replace } from '../../shared/models/replace';
import { EditorSideBarComponent } from '../editor-side-bar/editor-side-bar.component';
import { neuralnetwork } from '../../shared/models/neuralnetwork';
import * as tf from '@tensorflow/tfjs'

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
  statusBarHeight = 25;
  screenWidth = 0;
  screenHeight = 0;
  consoleWidth = 0;
  consoleHeight = 150;
  bodyHeight = 0;
  bodyWidth = 0;
  messages:message[] = [];
  @ViewChild(EditorBodyComponent,{static:true}) editorCode: EditorBodyComponent = new EditorBodyComponent(this.scriptService);
  @ViewChild(EditorConsoleComponent,{static:true}) editorConsole: EditorConsoleComponent = new EditorConsoleComponent();
  @ViewChild(EditorStatusBarComponent,{static:true}) editorStatusBar: EditorStatusBarComponent = new EditorStatusBarComponent();
  @ViewChild(EditorBodyComponent,{static:true}) editorBody: EditorBodyComponent = new EditorBodyComponent(this.scriptService);
  @ViewChild(EditorSideBarComponent,{static:true}) editorSideBar: EditorSideBarComponent = new EditorSideBarComponent();
  currentScript:script = empty;

  constructor(private readonly scriptService:ScriptService, private router: Router){
    this.currentScript = this.router.getCurrentNavigation()?.extras.state?.['value'];
  }

  ngOnInit(): void {
    console.log("editor");
    
    this.screenWidth = window.innerWidth;
    this.screenHeight = window.innerHeight;
    this.updateDimensions();
    
    document.dispatchEvent(new Event('editor-page'));
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

  async neuralnetworks():Promise<any>{
    console.log(name)
    const modelsInfo = localStorage.getItem("models");
    const result = new Object();

    if(modelsInfo === null)
      return null;
    else{
      const networks:neuralnetwork[] = JSON.parse(modelsInfo);
      const models:{name:string,model:tf.LayersModel,min:number[],max:number[],labels:string[]}[] = [];
      
      for(let count = 0; count < networks.length; count++){
        models.push({
          name: networks[count].name,
          model: await tf.loadLayersModel('localstorage://' + networks[count].name),
          min: networks[count].min as number[],
          max: networks[count].max as number[],
          labels: networks[count].labels as string[]
        })
      }

      return ((name:string,input:number[])=>{
        let index = -1;

        for(let count = 0; count < models.length && index === -1; count++){
          if(models[count].name === name)
            index = count;
        }

        if(index === -1)
          return "";

        //console.print(model("color-picker",[0,255,0]))
        const inputTensor = tf.tensor2d(input,[1,input.length]);
        const normalizedInput = inputTensor.sub(models[index].min).div(models[index].max).sub(models[index].min);
        const tensorResult = models[index].model.predict(normalizedInput) as tf.Tensor;
        index = Array.from(tf.argMax(tensorResult,1).dataSync())[0];

        return models[index].labels[index];
      })

      
    }

    return result;
  }

  changeTheme():void{
    const theme = localStorage.getItem("board-game-companion-script-editor-theme");

    if(theme !== null)
      this.editorCode.codeEditor.setTheme("ace/theme/" + theme.toLowerCase());
  }

  async execute(): Promise<void>{
    
    this.editorConsole.open();
    // try{
    const console = this.editorConsole.defineConsole();
    const model = await this.neuralnetworks();
    this.editorConsole.clear();
    
    const code = new Function("console","model",this.editorBody.getCode());
    code(console,model); 
    // this.scriptService.getFileData(this.currentScript.build.location).subscribe({
      
    //   next:(value)=>{
    //     //console.log(value)
    //     const code = new Function("console",value);
    //     code(console);    
    //   },
    //   error:(e)=>{
    //     console.log(e);
    //   }
    // });

    // }catch(err){
    //   console.log(err);
    // }

  }

  changesTracker(value:number): void{
    this.editorStatusBar.updateStatusOfChanges(value);
  }

  undo(): void{
    this.editorBody.undo();
  }

  redo(): void{
    this.editorBody.redo();
  }

  copy(): void{
    this.editorBody.copy();
  }

  paste(): void{
    this.editorBody.paste();
  }

  cut(): void{
    this.editorBody.cut();
  }

  find(value:find): void{
    this.editorBody.find(value);
  }

  findNext(): void{
    this.editorBody.findNext();
  }

  findPrevious(): void{
    this.editorBody.findPrevious(); 
  }

  replace(value:replace): void{
    this.editorBody.replace(value);
  }

  replaceAll(value:replace): void{
    this.editorBody.replaceAll(value);
  }

  sideBarResize(value:number): void{
    if(value <= this.editorSideBar.getMaxWidth()){
      this.sideBarWidth = value;
      this.updateDimensions();
    }
  }

  toggleSideBar(value:boolean): void{
    if(value){
      this.editorSideBar.open();
    }else{
      this.editorSideBar.close();
    }
  }

  toggleConsole(value:boolean): void{
    if(value){
      this.editorConsole.open();
    }else{
      this.editorConsole.close();
    }
  }

  newMessage(message:string): void{
    this.editorConsole.clear();
    this.editorConsole.print({type:false,outputMessage:message});
  }

}
