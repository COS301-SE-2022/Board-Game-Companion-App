import { Component, OnInit, HostListener, ViewChild} from '@angular/core';
import { EditorBodyComponent } from '../editor-body/editor-body.component';
import { EditorConsoleComponent } from '../editor-console/editor-console.component';
import { EditorStatusBarComponent } from '../editor-status-bar/editor-status-bar.component';
import { Router } from '@angular/router';
import { find } from '../../shared/models/editor/find';
import { replace } from '../../shared/models/editor/replace';
import { EditorToolBarComponent } from '../editor-tool-bar/editor-tool-bar.component';
import { EditorSideBarComponent } from '../editor-side-bar/editor-side-bar.component';
import { neuralnetwork } from '../../shared/models/neuralnetwork/neuralnetwork';
import * as tf from '@tensorflow/tfjs'
import { inputParameters } from '../../shared/models/scripts/inputParameters';
import { entity } from '../../shared/models/editor/entity';
import { selection } from '../../shared/models/editor/selection';
import { Ace } from 'ace-builds';
import { DragulaService } from 'ng2-dragula';
import { StorageService } from '../../shared/services/storage/storage.service';
import { myScript } from '../../shared/models/scripts/my-script';
import { EditorService } from '../../shared/services/editor/editor.service';
import { NotificationComponent } from '../../shared/components/notification/notification.component';
import { ModelsService } from '../../shared/services/models/models.service';
import { file } from '../../shared/models/general/file';

interface message{
  message: string;
  class: string;
}

interface tfModel{
  name: string;
  min: number[];
  max: number[];
  labels:string[];
  model: tf.LayersModel;
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
  @ViewChild(EditorBodyComponent,{static:true}) editorCode: EditorBodyComponent = new EditorBodyComponent(this.editorService, this.dragulaService);
  @ViewChild(EditorToolBarComponent,{static:true}) editorToolBar!: EditorToolBarComponent;
  @ViewChild(EditorConsoleComponent,{static:true}) editorConsole: EditorConsoleComponent = new EditorConsoleComponent();
  @ViewChild(EditorStatusBarComponent,{static:true}) editorStatusBar: EditorStatusBarComponent = new EditorStatusBarComponent();
  @ViewChild(EditorBodyComponent,{static:true}) editorBody: EditorBodyComponent = new EditorBodyComponent(this.editorService, this.dragulaService);
  @ViewChild(EditorSideBarComponent,{static:true}) editorSideBar: EditorSideBarComponent = new EditorSideBarComponent();
  @ViewChild(NotificationComponent,{static:true}) notification!: NotificationComponent;
  currentScript:myScript = new myScript();
  showInput = false;
  showOutput = false;
  inputBlock = false;
  outputBlock = false;
  inputResult:any[] = [];
  currPlayer = "";
  parameters:inputParameters[] = [];
  outputMessage = "";
  statusMessages:string[] = [];
  warningMessages:string[] = [];
  programStructure!:entity;
  count = 0;
  models:tfModel[] = [];
  interrupt = false;

  constructor(private readonly editorService:EditorService,
              private router: Router,
              public dragulaService: DragulaService,
              private readonly storageService: StorageService,
              private modelsService: ModelsService){
    this.currentScript = this.router.getCurrentNavigation()?.extras.state?.['value'];

    dragulaService.createGroup('COPYABLE', 
    {
      direction:'horizontal',
      removeOnSpill: true,
      copy: (el, source) => {
        return source.id === 'area';
      },
      copyItem: (obj) => {
        if(obj.id !== '')
        {
          return {title: obj.title, class: obj.class , id: obj.id, inputs: ["","","","","","","",""], pos: 0, true: 0, false: 0}
        }
        else
        {
          this.count++
          const id = "e" + this.count.toString()
          return {title: obj.title, class: obj.class , id: id, inputs: ["","","","","","","",""], pos: 0, true: 0, false: 0}
        }
        
      },
      accepts: (el, target, source, sibling) => {
        // To avoid dragging from right to left container
        if(target != null)
        {
          return target.id !== 'area';
        }
        else
        {
          return false;
        }
      }
    });
  }

  ngOnInit(): void {
    this.screenWidth = window.innerWidth;
    this.screenHeight = window.innerHeight;
    this.updateDimensions();    

    document.dispatchEvent(new Event('editor-page'));
    this.loadModels();
  }

  ngOnDestroy() : void
  {
    this.dragulaService.destroy("COPYABLE")
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
    window.setTimeout(()=>{
      this.editorBody.ngOnInit();
    },250);
  }

  updateScript(value:myScript): void{
    this.currentScript = value;
  }


  loadModels(): void{
    this.currentScript.models.forEach((id:string) => {
      //console.log("model-id" + id);
      
      this.modelsService.getModel(id).subscribe({
        next:(network:neuralnetwork) =>{
          const model = network.model as file;
          console.log(model.location);
          tf.loadLayersModel(model.location).then((value:tf.LayersModel) => {
            const temp = {
              name:network.name,
              model:value,
              min:network.min,
              max:network.max,
              labels:network.labels
            }

            this.models.push(temp);
          }).catch((err) => {
            console.log(err);
            this.notification.add({type:"warning",message:`Failed to load neural network model '${network.name}'`});
          })
        },
        error:() => {
          this.notification.add({type:"danger",message:"Failed to load model."});
        }
      })
    })
  }


  async neuralnetworks():Promise<any>{
      return (async(name:string,input:number[])=>{
        for(let count = 0; count < this.models.length; count++){
          if(this.models[count].name === name){
            try{
              const min = tf.tensor(this.models[count].min);
              const max = tf.tensor(this.models[count].max);
      
              const inputTensor = tf.tensor2d(input,[1,input.length]);
              const normalizedInput = inputTensor.sub(min).div(max).sub(min);
              this.models[count].model.layers
              const tensorResult = this.models[count].model.predict(normalizedInput) as tf.Tensor;
              console.log(input);
              tensorResult.print();
              const index = Array.from(tf.argMax(tensorResult,1).dataSync())[0];
              return this.models[count].labels[index];
            }catch(err){
              console.log(err);
            }
          }
        }

        return "";
      })
  }

  changeTheme():void{
    const theme = localStorage.getItem("board-game-companion-script-editor-theme");

    if(theme !== null)
      this.editorCode.codeEditor.setTheme("ace/theme/" + theme.toLowerCase());
  }

  output(){
    return (async(value:string) => {
      this.outputBlock = true;
      this.showOutput = true;
      this.outputMessage = value;
      
      const pause = new Promise((resolve)=>{
        const interval = setInterval(()=>{
            if(!this.outputBlock && this.interrupt){
                clearInterval(interval);
                resolve("Okay");
            }
        },10);
      });
  
      await pause;
    })
  }

  input(){
    return (async(prompt:string,type:string,options?:string[])=>{
      this.inputBlock = true;
      this.showInput = true;
      this.parameters = [{
        prompt:prompt,
        type:type,
        options:options
      }]
  
      const pause = new Promise((resolve)=>{
        const interval = setInterval(()=>{
            if(!this.inputBlock && this.interrupt){
                clearInterval(interval);
                resolve("Okay");
            }
        },10);
      });
  
      await pause;
  
      return this.inputResult[0];
    })
  }


  inputGroup(){
    return (async(parameters:inputParameters[])=>{
      
      this.inputBlock = true;
      this.showInput = true;
      this.parameters = parameters;
  
      const pause = new Promise((resolve)=>{
        const interval = setInterval(()=>{
            if(!this.inputBlock && this.interrupt){
                clearInterval(interval);
                resolve("Okay");
            }
        },10);
      });
  
      await pause;
  
      return this.inputResult;
    })
  }

  submitInput(value:any[]): void{
    this.inputResult = value;
    this.showInput = false;
    this.inputBlock = false;
  }

  okayOutput(): void{
    this.showOutput = false;
    this.outputBlock = false;
  }

  async getSandBox():Promise<any>{
    return {
      console: this.editorConsole.defineConsole(),
      model: await this.neuralnetworks(),
      input: this.input(),
      inputGroup: this.inputGroup(),
      output: this.output(),
      setCurrPlayer: this.setCurrPlayer(),
      interrupt: () => { return this.interrupt; }
    }
  }
setCurrPlayer(){
    return (async(value:string) => {
      //
      this.currPlayer = value;
    });
  }
  async interpreter(source:string){
    const strCode = 'with (sandbox) { ' + source + '}';
    const code = new Function('sandbox', strCode);
    const sandbox = await this.getSandBox();

    const proxy = new Proxy(sandbox,{
      has:(target:any,key:any)=>{
        return true;
      },
      get:(target:any,key:symbol)=>{
        if(target[key] === undefined && key != Symbol.unscopables){
          if(Object.keys(window).includes(String(key)) || String(key) === "document"){
            this.warningMessages.push("Access to " + String(key) + " is not allowed.");
          }
          console.log(key)
          return ()=>{return "Access to " + String(key) + " is not allowed."};
        }

        return target[key];            
      }     
    })

    this.warningMessages = [];
    code(proxy);
    this.editorStatusBar.updateWarningsCount(this.warningMessages.length);
  }

  stopExecution(): void{
    this.interrupt = true;
    this.showInput = false;
    this.showOutput = false;
    this.inputBlock = false;
    this.outputBlock = false;
  }


  async execute(): Promise<void>{
    
    this.editorConsole.open();
    
    try{
      // this.editorConsole.clear();
      // const code = new Function("model",this.editorBody.getCode());
      // code(await this.neuralnetworks());
      this.editorService.getFileData(this.currentScript.build.location).subscribe({
        next:async(value)=>{
          this.interrupt = false;
          this.interpreter(value);   
        },
        error:(e)=>{
          console.log(e.message);
        }
      });
    }catch(err){
      this.warningMessages.push(String(err));
      this.editorStatusBar.updateWarningsCount(this.warningMessages.length);
    }

  }

  changesTracker(value:number): void{
    this.editorStatusBar.updateStatusOfChanges(value);
  }

  setProgramStructure(value:entity): void{
    this.programStructure = value;
    this.currentScript.programStructure = value;
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

  toggleDisplay(value: boolean): void{
    this.editorSideBar.changeDisplay(value);
    this.editorBody.changeDisplay(value);
  }

  toggleConsole(value:boolean): void{
    if(value){
      this.editorConsole.open();
    }else{
      this.editorConsole.close();
    }
  }

  newMessage(message:string[]): void{
    this.statusMessages = [];
    this.statusMessages = message;
  }

  printStatusMessages(): void{
    this.editorConsole.clear();

    for(let count = 0; count < this.statusMessages.length; count++)
      this.editorConsole.print({output:true,outputMessage:this.statusMessages[count]});
      
  }

  printWarningMessages(): void{
    this.editorConsole.clear();

    for(let count = 0; count < this.warningMessages.length; count++)
      this.editorConsole.print({output:true,outputMessage:this.warningMessages[count]})
  }

  highlight(value:selection): void{
    this.editorBody.highlight(value);
  }

  remove(value:selection): void{
    this.editorBody.remove(value);
  }

  cursorChange(value:Ace.Point): void{
    this.editorSideBar.cursorChange(value);
  }

}
