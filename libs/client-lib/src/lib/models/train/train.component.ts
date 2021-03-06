import { Component, OnInit } from '@angular/core';

interface layer{
  index: number;
  activation: string;
  nodes: number;
}

@Component({
  selector: 'board-game-companion-app-train',
  templateUrl: './train.component.html',
  styleUrls: ['./train.component.scss'],
  
})
export class TrainComponent implements OnInit {
  tab = 0;
  trainingData = 80;
  inputFeature = "";
  outputLabel = "";
  inputs:string[] = []
  outputs:string[] = []
  hiddenLayers:layer[] = []
  activation = "activation function";
  nodes = 1;

  ngOnInit(): void{
    console.log("models")
  }

  changeTab(value:number): void{
    this.tab = value;
  }

  checkTrainingDataPercentage(): void{
    if(this.trainingData < 50)
      this.trainingData = 50;

    if(this.trainingData > 98)
      this.trainingData = 98
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

  setActivation(value:string): void{
    this.activation = value;
  }

  setActivationByIndex(index:number,value:string):void{
    this.hiddenLayers[index - 1].activation = value;
  }

  addLayer(): void{
    this.hiddenLayers.push({
      index: this.hiddenLayers.length + 1,
      nodes: this.nodes,
      activation: this.activation
    })
  }
}
