import { Component, OnInit, ViewChild } from '@angular/core';
import { NotificationComponent } from '../../shared/components/notification/notification.component';

@Component({
  selector: 'board-game-companion-app-load-data',
  templateUrl: './load-data.component.html',
  styleUrls: ['./load-data.component.scss'],
})
export class LoadDataComponent implements OnInit {
  trainingData = 80;
  fileType = "application/json";
  data:any = null;
  dataStore:any = null;
  inputFeature = "";
  outputLabel = "";
  inputs:string[] = []
  outputs:string[] = []
  analysis:string[] = [];
  @ViewChild(NotificationComponent,{static:true}) notifications: NotificationComponent = new NotificationComponent();

  ngOnInit(): void{
    this.trainingData = 80;
  }

  getDataStore(): any{
    return this.dataStore;
  } 

  getData(): any{
    return this.data;
  }

  getFileType(): string{
    return this.fileType;
  }

  getInputs(): string[]{
    return this.inputs;
  }

  getOutputs(): string[]{
    return this.outputs;
  }

  getTrainingPercentage(): number{
    return this.trainingData;
  }

  loadData(value:any): void{
    const reader = new FileReader();
    
    reader.readAsText(value.target.files[0]);

    const type = value.target.files[0].type;

    if(this.fileType !== type){
      this.fileType = type;
      this.inputs = [];
      this.outputs = [];
    }

    console.log(value.target.files[0]);

    if(this.fileType === undefined)
      this.notifications.add({type:"danger",message:"Unsupported file type."});
    else if(this.fileType === "application/json"){
      reader.onload = (event)=>{
        if(event.target !== null){
          if(typeof(event.target.result) == "string"){
            try{
              this.dataStore = this.data = JSON.parse(event.target.result);
            }catch(error){
              this.notifications.add({type:"danger",message:"Error parsing json file " + value.target.files[0].name});
            }
          }else
            this.notifications.add({type:"danger",message:"Expecting " + value.target.files[0].name + " to contain string data but contains " + typeof(event.target.result)});
        }else
          this.notifications.add({type:"danger",message:"Something went wrong when loading json file"});
        
        console.log(this.data);
      }
    }else if(this.fileType === "text/csv"){
      reader.onload = (event)=>{
        if(event.target !== null){
          if(typeof(event.target.result) == "string"){
            let temp = null;

            if(event.target.result.indexOf("\r\n") !== -1)
              temp =  event.target.result.split("\r\n");
            else
              temp = event.target.result.split("\n");

            this.dataStore = this.data = temp.map((value:string) =>{
              const result:any[] = [];

              value.split(",").forEach((cell:string)=>{
                if(isNaN(parseFloat(cell)))
                  result.push(cell);
                else
                  result.push(parseFloat(cell));
              });

              return result;
            })
          }else
          this.notifications.add({type:"danger",message:"Expecting " + value.target.files[0].name + " to contain string data but contains " + typeof(event.target.result)});
        }else
        this.notifications.add({type:"danger",message:"Something went wrong when loading csv file"});
        console.log(this.data);
      }
    }else
      this.notifications.add({type:"danger",message:"Unsupported file type."});
  }

  checkTrainingDataPercentage(): void{
    if(this.trainingData < 50)
      this.trainingData = 50;

    if(this.trainingData > 98)
      this.trainingData = 98
  }

  checkInputOnEnter(value:any): void{
    console.log(value);

    if(value.key === "Enter"){
      value?.preventDefault();
      this.addInputFeature();
    }
  }

  checkOutputOnEnter(value:any): void{
    console.log(value);
    
    if(value.key === "Enter"){
      value?.preventDefault();
      this.addOutputFeature();
    }
  }

  addInputFeature(): void{
    if(this.inputFeature !== ""){
      if(!this.alreadyExists(this.inputFeature))
        this.inputs.push(this.inputFeature);
      else
        this.notifications.add({type:'warning',message:'Duplicate features not allowed.'});
      this.inputFeature = "";
    }else
      this.notifications.add({type:'warning',message:'Can not use empty feature.'});
  }

  alreadyExists(value:string): boolean{
    let result = false;

    for(let count = 0; count < this.inputs.length && !result; count++){
      if(this.inputs[count] === value)
        result = true;
    }

    for(let count = 0; count < this.outputs.length && !result; count++){
      if(this.outputs[count] === value)
        result = true;
    }

    return result;
  }

  addOutputFeature(): void{
    if(this.outputLabel !== ""){
      if(!this.alreadyExists(this.outputLabel))
        this.outputs.push(this.outputLabel);
      else
        this.notifications.add({type:'warning',message:'Duplicate labels not allowed.'});

      this.outputLabel = "";
    }else
    this.notifications.add({type:'warning',message:'Can not use empty label.'});
  }


  removeInput(value:string): void{
    const temp:string[] = [];

    for(let count = 0; count < this.inputs.length; count++){
      if(value!== this.inputs[count])
        temp.push(this.inputs[count]);
    }

    this.inputs = temp;    
  }

  removeLabel(value:string): void{
    const temp:string[] = [];

    for(let count = 0; count < this.outputs.length; count++){
      if(value!== this.outputs[count])
        temp.push(this.outputs[count]);
    }

    this.outputs = temp;
  }

  preCheckData(): boolean{
    let result = true;

    if(this.dataStore === null){
      this.notifications.add({type:"danger",message:"No data provided."});
      result = false;
    }else if(typeof this.dataStore !== "object"){
      this.notifications.add({type:"danger",message:"The input file does not contain array of data."});
      result = false;
    }else{
      if(this.fileType === "application/json" && Array.isArray(this.dataStore) === false){
        this.notifications.add({type:"danger",message:"The input file does not contain array of data."});
        result = false;
      }
    }

    return result;
  }

  cleanJsonData(): void{
    let temp = true;

    this.data = [];

    for(let count = 0; count < this.dataStore.length; count++){
      if(typeof this.dataStore[count] === "object"){
        if(Array.isArray(this.dataStore[count]) === false){
          temp = true;
          
          this.inputs.forEach((value:string)=>{
            if(this.dataStore[count][value] === null || this.dataStore[count][value] === undefined)
              temp = false;
          });

          if(temp)
            this.data.push(this.dataStore[count])
        }
      }
    }
  }

  cleanCsvData(): void{
    this.data = [];
    const temp = this.inputs.concat(this.outputs).map(value => parseFloat(value));
    const max:number = Math.max(...temp);

    for(let count = 0; count < this.dataStore.length; count++){
      if(this.dataStore[count].length > max)
        this.data.push(this.dataStore[count]);
    }
  }

  analyse():void{
    this.analysis = [];
    
    if(this.preCheckData()){
      if(this.fileType === "application/json")
        this.cleanJsonData();
      else
        this.cleanCsvData();

      const removed = this.dataStore.length - this.data.length;
      this.analysis.push("Removed " + removed + " invalid data " + (removed === 1 ? "entry":"entries"))
      this.analysis.push("Total data: " + this.data.length.toString());
      this.analysis.push("Total trainings data: " + Math.ceil((this.trainingData / 100) * this.data.length));
      this.analysis.push("Total testing data: " + Math.floor(((100 - this.trainingData) / 100) * this.data.length));
    }
  }
}
