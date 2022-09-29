import { Component, OnInit } from '@angular/core';
import { ScriptService } from '../../shared/services/scripts/script.service';
  import { Router } from '@angular/router';
import { script } from '../../shared/models/scripts/script';
import { neuralnetwork } from '../../shared/models/neuralnetwork/neuralnetwork';
import { BggSearchService } from '../../board-game-search/bgg-search-service/bgg-search.service';
import * as tf from '@tensorflow/tfjs'
import { entity } from '../../shared/models/editor/entity';
import { inputParameters } from '../../shared/models/scripts/inputParameters';
import { StorageService } from '../../shared/services/storage/storage.service';

@Component({
  selector: 'board-game-companion-app-script-executor',
  templateUrl: './script-executor.component.html',
  styleUrls: ['./script-executor.component.scss'],
})
export class ScriptExecutorComponent implements OnInit {
  current:script;
  code = "";
  replay = false;
  folder = "42a58303-990e-4230-94c6-a9f5dd629500"
  hours = "hours";
  h = 0;
  min = "min";
  m = 0;
  s = 0;
  sec = "sec";
  gameName = ""
  currPlayer = ""
  showInput = false;
  showOutput = false;
  inputBlock = false;
  outputBlock = false;
  inputResult = "";
  parameters:inputParameters[] = [];
  outputMessage = "";
  statusMessages:string[] = [];
  warningMessages:string[] = [];
  programStructure!:entity;
  count = 0;
  history:string[] = [];
  playerAtHistory:string[] = [];
  recentPrompt = "";
  historyVisible = false;

  constructor(private readonly searchService:BggSearchService, private readonly scriptService:ScriptService, private router:Router,private readonly storageService: StorageService) {
    this.current = this.router.getCurrentNavigation()?.extras.state?.['value'];
    this.searchService.getComments("https://boardgamegeek.com/xmlapi2/thing?id="+this.current.boardgame)
            .subscribe(
              
              data=>{
                
                
                const result:string = data.toString();

                const parseXml = new window.DOMParser().parseFromString(result, "text/xml");
                parseXml.querySelectorAll("name").forEach(n=>{
                    if(this.gameName == "")
                      this.gameName = n.getAttribute("value") || "";
                 
                });
              })
  }

  
  back()
  {
    //Timer
    if(localStorage.getItem("sessions") !== null)
    {
      const c = JSON.parse(localStorage.getItem("sessions")||"")
      const name = "#" + (c.length + 1);
      c.push(name);
      localStorage.setItem("sessions", JSON.stringify(c))
      const session = []
      session.push(this.gameName)
      session.push(this.current.name)
      session.push("2")
      session.push("N/A")
      this.hours = this.h + this.hours + " "
      this.min = this.m + this.min + " "
      this.sec = this.s + this.sec 
      session.push(this.hours + this.min + this.sec)
      session.push("Win")
      const now = new Date();
      session.push(now.toLocaleDateString())
      session.push(this.current.boardgame)
      session.push(this.history)
      session.push(this.playerAtHistory)
      session.push(this.current._id)
      localStorage.setItem(name, JSON.stringify(session))
    }
    else
    {
      const c = [];
      const name = "#1";
      c.push(name);
      localStorage.setItem("sessions", JSON.stringify(c))
      const session = []
      session.push(this.gameName)
      session.push(this.current.name)
      session.push("2")
      session.push("N/A")
      this.hours = this.h + this.hours + " "
      this.min = this.m + this.min + " "
      this.sec = this.s + this.sec
      session.push(this.hours + this.min + this.sec)
      session.push("Win")
      const now = new Date();
      session.push(now.toLocaleDateString())
      session.push(this.current.boardgame)
      session.push(this.history)
      session.push(this.playerAtHistory)
      session.push(this.current._id)
      localStorage.setItem(name, JSON.stringify(session))
    }

    //this.router.navigate(['scripts']);
  }

  ngOnDestroy()
  {
    this.back()
  }
  
  ngOnInit(): void {
    setInterval(() => {
      this.s++
      if(this.s === 60)
      {
        this.m++
      }
      if(this.m === 60)
      {
        this.h++
      }
    }, 1000);

      this.scriptService.getFileData(this.current.build.location).subscribe({
        next:(val)=>{
          
           this.code = val;
           this.interpreter(val);  
        },
        error:(e)=>{
          console.log(e)
        },
        complete:()=>{
          console.log("complete")
        }  
      })
  }
  async neuralnetworks():Promise<any>{
    return (async(name:string,input:number[])=>{
      const info = await this.storageService.getByIndex("networks","name",name);

      if(info.name == undefined)
        return "";

      const model = await tf.loadLayersModel(`indexeddb://${info.name}`);
      const min = tf.tensor(info.min);
      const max = tf.tensor(info.max);

      const inputTensor = tf.tensor2d(input,[1,input.length]);
      const normalizedInput = inputTensor.sub(min).div(max).sub(min);
      const tensorResult = model.predict(normalizedInput) as tf.Tensor;
      //tensorResult.print();
      const index = Array.from(tf.argMax(tensorResult,1).dataSync())[0];
      return info.labels[index];
    })
}
  async play(): Promise<void>{
    this.replay = false;
    const code = new Function("model",this.code);
    const model =  await this.neuralnetworks();
    code(model);
    this.replay = true;
  }
  output(){
    return (async(value:string) => {
      console.log("yes please stop")
      this.inputBlock = true;
      this.showOutput = true;
      const outputElem = document.getElementById("TextOutput");
      if(outputElem)
      {
        outputElem.innerHTML = value + "<br>Press Enter to continue";
      }
      this.history.push(">>>> "+value);
      this.playerAtHistory.push(this.currPlayer);
      console.log(this.history)
      this.recentPrompt = value + "<br>Press Enter to continue";

      const pause = new Promise((resolve)=>{
        const interval = setInterval(()=>{
            if(!this.inputBlock){
                clearInterval(interval);
                resolve("Okay");
            }
        },10);
      });
      
      await pause;
    })
  }
  setCurrPlayer(){
    return (async(value:string) => {
      //
      this.currPlayer = value;
    });
  }
  input(){
    
    return (async(prompt:string,type:string,options?:string[])=>{
      this.inputBlock = true;
      
      const elem = document.getElementById("TextOutput");
      if(elem)
        elem.innerHTML += prompt+"\n";
      this.history.push(">>>> "+prompt);
      this.playerAtHistory.push(this.currPlayer)
      this.recentPrompt = prompt;
      const pause = new Promise((resolve)=>{
        const interval = setInterval(()=>{
            if(!this.inputBlock){
                clearInterval(interval);
                resolve("Okay");
            }
        },10);
      });
  
      await pause;
  
      return this.inputResult;
    })
  }


  inputGroup(){
    return (async(parameters:inputParameters[])=>{
      console.log(parameters);
      
      this.inputBlock = true;
      this.showInput = true;
      this.parameters = parameters;
  
      const pause = new Promise((resolve)=>{
        const interval = setInterval(()=>{
            if(!this.inputBlock){
                clearInterval(interval);
                resolve("Okay");
            }
        },10);
      });
  
      await pause;
  
      return this.inputResult;
    })
  }

  submitInput(): void{
    
    const inputElem = document.getElementById("inputBox") as HTMLInputElement;
    if(inputElem)
    {
      this.inputResult = inputElem.value;
      inputElem.value = "";
    }
    const outputElem = document.getElementById("TextOutput");
    if(outputElem)
    {
      outputElem.innerHTML = "";
    }
    this.history.push("<<<< "+this.inputResult) ;
    this.playerAtHistory.push(this.currPlayer);
    this.showInput = false;
    this.inputBlock = false;
  }
  showHistory(): void{
    const elem = document.getElementById("TextOutput");
    const button = document.getElementById("hDiv");
    
    if(this.historyVisible)
    {
      
      if(elem)
      {
        elem.innerHTML = this.recentPrompt;
      }
      
      if(button)
      {
        button.innerHTML = "History";
      }
    }
    else
    {
      const button = document.getElementById("hDiv");
      if(button)
      {
        button.innerHTML = "Back";
      }
      if(elem)
      {
        elem.innerHTML = "";
        let cPlayer = "";
        for(let i = 0; i< this.history.length;i++)
        {
          console.log(this.playerAtHistory[i])
          if(cPlayer != this.playerAtHistory[i])
          {
            
            elem.innerHTML += "<div style=\"border:1px solid black;\" class= \"bg-green-700 text-center font-bold\">" +this.playerAtHistory[i]+"</div>";
            cPlayer = this.playerAtHistory[i];
          }
          elem.innerHTML += "<div class= \"bg-grey-200\">" +this.history[i]+"</div>";
        }
        
      }
    }
    this.historyVisible = !this.historyVisible;
  }
  okayOutput(): void{
    const outputElem = document.getElementById("TextOutput");
    if(outputElem)
    {
      outputElem.innerHTML = "";
    }
    this.showOutput = false;
    this.outputBlock = false;
  }
  async getSandBox():Promise<any>{
    return {
      
      model: await this.neuralnetworks(),
      input: this.input(),
      inputGroup: this.inputGroup(),
      output: this.output(),
      setCurrPlayer: this.setCurrPlayer()

    }
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
  }
}
