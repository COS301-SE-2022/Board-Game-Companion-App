import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'board-game-companion-app-load-data',
  templateUrl: './load-data.component.html',
  styleUrls: ['./load-data.component.scss'],
  
})
export class LoadDataComponent implements OnInit {
  trainingData = 80;
  data:any = null;
  dataStore:any = null;
  inputFeature = "";
  outputLabel = "";
  inputs:string[] = []
  outputs:string[] = []
  analysis:string[] = [];

  ngOnInit(): void{
    this.trainingData = 80;
  }

  getDataStore(): any{
    return this.dataStore;
  } 

  getData(): any{
    return this.data;
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
    
    if(value.target !== null)
      reader.readAsText(value.target.files[0]);

    console.log(value);

    reader.onload = (event)=>{
      if(event.target !== null){
        
        if(typeof(event.target.result) == "string"){
          this.dataStore = this.data = JSON.parse(event.target.result);
        }
      }
    }
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
      
      this.inputFeature = "";
    }
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
      
      this.outputLabel = "";
    }
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

  analyse():void{
    this.analysis = [];

    console.log("analyse")
    if(this.dataStore === null){
      this.analysis.push("The data contains null data.");
    }else if(typeof this.dataStore !== "object"){
      this.analysis.push("The input file does not contain array of data.");
    }else{
      if(Array.isArray(this.dataStore) === false){
        this.analysis.push("The input file does not contain array of data.");
      }else{
        const tempData:any[] = [];
        let removed = 0;
        let temp = true;

        for(let count = 0; count < this.dataStore.length; count++){
          if(typeof this.dataStore[count] === "object"){
            if(Array.isArray(this.dataStore[count]) === false){
              temp = true;
              
              this.inputs.forEach((value:string)=>{
                if(this.dataStore[count][value] === null || this.dataStore[count][value] === undefined)
                  temp = false;
              });

              if(temp)
                tempData.push(this.dataStore[count]);
              else
                removed++;
            }else
              removed++;
          }else
            removed++;
        }

        this.data = tempData;

        this.analysis.push("Removed " + removed.toString() + " invalid data entries.")
        this.analysis.push("Total data: " + this.data.length.toString());
        this.analysis.push("Total trainings data: " + Math.floor((this.trainingData / 100) * this.data.length));
        this.analysis.push("Total testing data: " + Math.floor(((100 - this.trainingData) / 100) * this.data.length));

      }
    }
  }
}
