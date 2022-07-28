import { Component, EventEmitter, OnInit,Output } from '@angular/core';
import { ModelsService,layer } from '../../shared/services/models/models.service';
import * as tf from '@tensorflow/tfjs'
import { beginTraining } from '../../shared/models/beginTraining';

@Component({
  selector: 'board-game-companion-app-train',
  templateUrl: './train.component.html',
  styleUrls: ['./train.component.scss'],
  
})
export class TrainComponent implements OnInit {
  @Output() beginTrainingEvent = new EventEmitter<beginTraining>();
  tab = 0;
  trainingData = 80;
  inputFeature = "";
  outputLabel = "";
  inputs:string[] = []
  outputs:string[] = []
  hiddenLayers:layer[] = []
  activation = "activation function";
  nodes = 1;
  data:any = null;
  dataStore:any = null;
  analysis:string[] = [];
  step = 0;
  optimizer = 0;
  name = "";
  learningRate = "";
  rho = "";
  initialAccumulatorValue = "";
  beta1 = "";
  beta2 = "";
  epsilon = "";
  decay = "";
  momentum = "";
  useNesterov = false;
  centered = false;
  missing:string[] = []
  trainMessage:string[] = []
  epochs = 32;

  constructor(private readonly modelsService:ModelsService){}

  ngOnInit(): void{
    console.log("models")
  }

  removeLayer(value:layer): void{
    const temp:layer[] = [];

    this.hiddenLayers.forEach((each:layer)=>{
      if(each.index != value.index)
        temp.push(each);
    })

    this.hiddenLayers = temp;
  }

  setOptimizer(value:number):void{
    this.optimizer = value;
    this.missing = [];
    this.trainMessage = [];
    this.learningRate = "";
    this.rho = "";
    this.initialAccumulatorValue = "";
    this.beta1 = "";
    this.beta2 = "";
    this.epsilon = "";
    this.decay = "";
    this.momentum = "";
  }

  changeStep(value:number){
    if(value === 1 && this.enableArchitecture())
      this.step = value;
    else if(value === 2 && this.enableConfigure())
      this.step = value;
    else if(value === 0)
      this.step = value  
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

  loadData(value:any): void{
    const reader = new FileReader();
    reader.readAsText(value.target.files[0]);

    reader.onload = (event)=>{
      if(event.target !== null){
        
        if(typeof(event.target.result) == "string"){
          this.dataStore = this.data = JSON.parse(event.target.result);
        }
      }
    }
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
      activation: (this.activation == "activation function" ? "none" : this.activation)
    })
  }

  enableArchitecture(): boolean{
      if(this.data === null)
        return false;

      if(this.inputs.length === 0)
        return false;
        
      if(this.outputs.length === 0)
        return false;

      return true;
  }

  enableConfigure(): boolean{
    if(!this.enableArchitecture())
      return false;

    if(this.hiddenLayers.length === 0)
      return false;

    return true;
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

  train(): void{
    let optimizer:tf.Optimizer = tf.train.sgd(0.2);
    this.trainMessage = [];
    this.missing = [];

    if(this.name === ""){
      this.trainMessage.push("The name of the neural network is missing")
      this.trainMessage.push("The name of the neural network is missing")
    }

    if(this.learningRate !== "" && isNaN(parseFloat(this.learningRate)) === true ){
      this.trainMessage.push("Learning rate must be a number");
      this.missing.push("learningRate");
    }

    if(this.rho !== "" && isNaN(parseFloat(this.rho)) === true ){
      this.trainMessage.push("Decay rate must be a number");
      this.missing.push("rho");
    }

    if(this.decay !== "" && isNaN(parseFloat(this.decay)) === true ){
      this.trainMessage.push("Decat rate must be a number");
      this.missing.push("decay");
    }

    if(this.epsilon !== "" && isNaN(parseFloat(this.epsilon)) === true ){
      this.trainMessage.push("Epsilon must be a number");
      this.missing.push("epsilon");
    }

    if(this.beta1 !== "" && isNaN(parseFloat(this.beta1)) === true ){
      this.trainMessage.push("Beta1 must be a number");
      this.missing.push("beta1");
    }

    if(this.beta2 !== "" && isNaN(parseFloat(this.beta2)) === true ){
      this.trainMessage.push("beta2 must be a number");
      this.missing.push("beta2");
    }

    if(this.initialAccumulatorValue !== "" && isNaN(parseFloat(this.initialAccumulatorValue)) === true ){
      this.trainMessage.push("Initial accumulator value must be a number");
      this.missing.push("initialAccumulatorValue");
    }

    if(this.momentum !== "" && isNaN(parseFloat(this.momentum)) === true ){
      this.trainMessage.push("Momentum must be a number");
      this.missing.push("momentum");
    }

    if(this.missing.length !== 0)
      return

    

    if(this.optimizer === 0){
        optimizer = this.modelsService.getOptimizationFunction(this.optimizer,{
          learningRate:(this.learningRate === "" ? undefined : parseFloat(this.learningRate)),
          rho:(this.learningRate === "" ? undefined : parseFloat(this.learningRate))
        });

    }else if(this.optimizer === 1){
      if(this.learningRate === ""){
        this.trainMessage.push("Learning rate is required.");
        this.missing.push("learningRate");
        return;
      }
          
      optimizer = this.modelsService.getOptimizationFunction(this.optimizer,{
        learningRate:parseFloat(this.learningRate),
        initialAccumulatorValue:(this.initialAccumulatorValue === "" ? undefined : parseFloat(this.initialAccumulatorValue))
      });
       
    }else if(this.optimizer === 2){
      optimizer = this.modelsService.getOptimizationFunction(this.optimizer,{
        learningRate:(this.learningRate === "" ? undefined : parseFloat(this.learningRate)),
        decay:(this.decay === "" ? undefined : parseFloat(this.decay)),
        epsilon:(this.epsilon === "" ? undefined : parseFloat(this.epsilon)),
        beta1:(this.beta1 === "" ? undefined : parseFloat(this.beta1)),
        beta2:(this.epsilon === "" ? undefined : parseFloat(this.epsilon))
      });
    }else if(this.optimizer === 3){
      optimizer = this.modelsService.getOptimizationFunction(this.optimizer,{
        learningRate:(this.learningRate === "" ? undefined : parseFloat(this.learningRate)),
        decay:(this.decay === "" ? undefined : parseFloat(this.decay)),
        epsilon:(this.epsilon === "" ? undefined : parseFloat(this.epsilon)),
        beta1:(this.beta1 === "" ? undefined : parseFloat(this.beta1)),
        beta2:(this.epsilon === "" ? undefined : parseFloat(this.epsilon))
      });
    }else if(this.optimizer === 4){
      if(this.learningRate === ""){
        this.trainMessage.push("Learning rate is required.");
        this.missing.push("learningRate");
      }

      if(this.momentum === ""){
        this.trainMessage.push("Momentum value is required.");
        this.missing.push("momentum");
      }

      if(this.missing.length > 0)
        return;

      optimizer = this.modelsService.getOptimizationFunction(this.optimizer,{
        learningRate:(this.learningRate === "" ? undefined : parseFloat(this.learningRate)),
        momentum:(this.momentum === "" ? undefined : parseFloat(this.momentum)),
        useNesterov:this.useNesterov
      });
    }else if(this.optimizer === 5){
      if(this.learningRate === ""){
        this.trainMessage.push("Learning rate is required.");
        this.missing.push("learningRate");
      }

      if(this.missing.length > 0)
        return;

        optimizer = this.modelsService.getOptimizationFunction(this.optimizer,{
          learningRate:(parseFloat(this.learningRate)),
          momentum:(this.momentum === "" ? undefined : parseFloat(this.momentum)),
          decay:(this.decay === "" ? undefined : parseFloat(this.decay)),
          epsilon:(this.epsilon === "" ? undefined : parseFloat(this.epsilon)),
          centered:this.centered
        });
      
    }else if(this.optimizer === 6){
      if(this.learningRate === ""){
        this.trainMessage.push("Learning rate is required.");
        this.missing.push("learningRate");
      }

      if(this.missing.length > 0)
        return;

        optimizer = this.modelsService.getOptimizationFunction(this.optimizer,{
          learningRate:(parseFloat(this.learningRate))
        });
    }

    const tensorData = this.modelsService.convertToTensors(this.data,this.inputs,this.outputs[0]);
    const model = this.modelsService.createModel(this.inputs.length,tensorData.labels.length,this.hiddenLayers);
    const xs = tensorData.inputs;
    
    tensorData.outputs.print();
    const ys = tf.oneHot(tensorData.outputs,tensorData.labels.length);
    const trainingLength = Math.floor((this.trainingData / 100) * this.data.length);

    this.beginTrainingEvent.emit({
      name: this.name,
      model: model,
      xs: xs,
      ys: ys,
      optimizer: optimizer,
      epochs: this.epochs,
      dataDivider: [trainingLength,this.data.length - trainingLength]
    });
    //this.modelsService.train(model,xs,ys,optimizer);
    // const value = tf.tensor2d([123,5,17],[1,3]);
    // value.sub(tensorData.inputMin).div(tensorData.inputMax.sub(tensorData.inputMin));
    // const result = model.predict(value) as tf.Tensor;

    // result.print();

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
