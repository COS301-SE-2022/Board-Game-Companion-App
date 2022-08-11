import { Component, EventEmitter, OnInit,Output, ViewChild } from '@angular/core';
import { ModelsService } from '../../shared/services/models/models.service';
import { layer } from '../../shared/models/layer';
import * as tf from '@tensorflow/tfjs'
import { beginTraining } from '../../shared/models/beginTraining';
import { LoadDataComponent } from '../load-data/load-data.component';
import { ArchitectureComponent } from '../architecture/architecture.component';
import { ConfigureComponent } from '../configure/configure.component';

@Component({
  selector: 'board-game-companion-app-train',
  templateUrl: './train.component.html',
  styleUrls: ['./train.component.scss'],
  
})
export class TrainComponent implements OnInit {
  @Output() beginTrainingEvent = new EventEmitter<beginTraining>();
  @ViewChild(LoadDataComponent,{static:true}) dataLoader: LoadDataComponent = new LoadDataComponent();
  @ViewChild(ArchitectureComponent,{static:true}) architectureSetup: ArchitectureComponent = new ArchitectureComponent();
  @ViewChild(ConfigureComponent,{static:true}) configuration: ConfigureComponent = new ConfigureComponent();

  enableArchitecture = false;
  enableConfigure = false;
  tab = 0;
  step = 0;
  missing:string[] = []
  trainMessage:string[] = []
  

  constructor(private readonly modelsService:ModelsService){}

  ngOnInit(): void{
    console.log("models")
  }

  changeStep(value:number){
    if(value === 1 && this.enableArchitecture)
      this.step = value;
    else if(value === 2 && this.enableConfigure)
      this.step = value;
    else if(value === 0)
      this.step = value  
  }

  changeTab(value:number): void{
    this.tab = value;
  }

  train(): void{
    let optimizer:tf.Optimizer = tf.train.sgd(0.2);
    this.trainMessage = [];
    this.missing = [];

    if(this.configuration.getName() === ""){
      this.trainMessage.push("The name of the neural network is missing")
      this.missing.push("The name of the neural network is missing")
    }

    if(this.configuration.getLearningRate() !== "" && isNaN(parseFloat(this.configuration.getLearningRate())) === true ){
      this.trainMessage.push("Learning rate must be a number");
      this.missing.push("learningRate");
    }

    if(this.configuration.getRho() !== "" && isNaN(parseFloat(this.configuration.getRho())) === true ){
      this.trainMessage.push("Decay rate must be a number");
      this.missing.push("rho");
    }

    if(this.configuration.getDecay() !== "" && isNaN(parseFloat(this.configuration.getDecay())) === true ){
      this.trainMessage.push("Decat rate must be a number");
      this.missing.push("decay");
    }

    if(this.configuration.getEpsilon() !== "" && isNaN(parseFloat(this.configuration.getEpsilon())) === true ){
      this.trainMessage.push("Epsilon must be a number");
      this.missing.push("epsilon");
    }

    if(this.configuration.getBeta1() !== "" && isNaN(parseFloat(this.configuration.getBeta1())) === true ){
      this.trainMessage.push("Beta1 must be a number");
      this.missing.push("beta1");
    }

    if(this.configuration.getBeta2() !== "" && isNaN(parseFloat(this.configuration.getBeta2())) === true ){
      this.trainMessage.push("beta2 must be a number");
      this.missing.push("beta2");
    }

    if(this.configuration.getInitialAccumulatorValue() !== "" && isNaN(parseFloat(this.configuration.getInitialAccumulatorValue())) === true ){
      this.trainMessage.push("Initial accumulator value must be a number");
      this.missing.push("initialAccumulatorValue");
    }

    if(this.configuration.getMomentum() !== "" && isNaN(parseFloat(this.configuration.getMomentum())) === true ){
      this.trainMessage.push("Momentum must be a number");
      this.missing.push("momentum");
    }

    if(this.missing.length !== 0)
      return

    

    if(this.configuration.getOptimizer() === 0){
        optimizer = this.modelsService.getOptimizationFunction(this.configuration.getOptimizer(),{
          learningRate:(this.configuration.getLearningRate() === "" ? undefined : parseFloat(this.configuration.getLearningRate())),
          rho:(this.configuration.getLearningRate() === "" ? undefined : parseFloat(this.configuration.getLearningRate()))
        });

    }else if(this.configuration.getOptimizer() === 1){
      if(this.configuration.getLearningRate() === ""){
        this.trainMessage.push("Learning rate is required.");
        this.missing.push("learningRate");
        return;
      }
          
      optimizer = this.modelsService.getOptimizationFunction(this.configuration.getOptimizer(),{
        learningRate:parseFloat(this.configuration.getLearningRate()),
        initialAccumulatorValue:(this.configuration.getInitialAccumulatorValue() === "" ? undefined : parseFloat(this.configuration.getInitialAccumulatorValue()))
      });
       
    }else if(this.configuration.getOptimizer() === 2){
      optimizer = this.modelsService.getOptimizationFunction(this.configuration.getOptimizer(),{
        learningRate:(this.configuration.getLearningRate() === "" ? undefined : parseFloat(this.configuration.getLearningRate())),
        decay:(this.configuration.getDecay() === "" ? undefined : parseFloat(this.configuration.getDecay())),
        epsilon:(this.configuration.getEpsilon() === "" ? undefined : parseFloat(this.configuration.getEpsilon())),
        beta1:(this.configuration.getBeta1() === "" ? undefined : parseFloat(this.configuration.getBeta1())),
        beta2:(this.configuration.getEpsilon() === "" ? undefined : parseFloat(this.configuration.getEpsilon()))
      });
    }else if(this.configuration.getOptimizer() === 3){
      optimizer = this.modelsService.getOptimizationFunction(this.configuration.getOptimizer(),{
        learningRate:(this.configuration.getLearningRate() === "" ? undefined : parseFloat(this.configuration.getLearningRate())),
        decay:(this.configuration.getDecay() === "" ? undefined : parseFloat(this.configuration.getDecay())),
        epsilon:(this.configuration.getEpsilon() === "" ? undefined : parseFloat(this.configuration.getEpsilon())),
        beta1:(this.configuration.getBeta1() === "" ? undefined : parseFloat(this.configuration.getBeta1())),
        beta2:(this.configuration.getEpsilon() === "" ? undefined : parseFloat(this.configuration.getEpsilon()))
      });
    }else if(this.configuration.getOptimizer() === 4){
      if(this.configuration.getLearningRate() === ""){
        this.trainMessage.push("Learning rate is required.");
        this.missing.push("learningRate");
      }

      if(this.configuration.getMomentum() === ""){
        this.trainMessage.push("Momentum value is required.");
        this.missing.push("momentum");
      }

      if(this.missing.length > 0)
        return;

      optimizer = this.modelsService.getOptimizationFunction(this.configuration.getOptimizer(),{
        learningRate:(this.configuration.getLearningRate() === "" ? undefined : parseFloat(this.configuration.getLearningRate())),
        momentum:(this.configuration.getMomentum() === "" ? undefined : parseFloat(this.configuration.getMomentum())),
        useNesterov:this.configuration.getUseNesterov()
      });
    }else if(this.configuration.getOptimizer() === 5){
      if(this.configuration.getLearningRate() === ""){
        this.trainMessage.push("Learning rate is required.");
        this.missing.push("learningRate");
      }

      if(this.missing.length > 0)
        return;

        optimizer = this.modelsService.getOptimizationFunction(this.configuration.getOptimizer(),{
          learningRate:(parseFloat(this.configuration.getLearningRate())),
          momentum:(this.configuration.getMomentum() === "" ? undefined : parseFloat(this.configuration.getMomentum())),
          decay:(this.configuration.getDecay() === "" ? undefined : parseFloat(this.configuration.getDecay())),
          epsilon:(this.configuration.getEpsilon() === "" ? undefined : parseFloat(this.configuration.getEpsilon())),
          centered:this.configuration.getCentered()
        });
      
    }else if(this.configuration.getOptimizer() === 6){
      if(this.configuration.getLearningRate() === ""){
        this.trainMessage.push("Learning rate is required.");
        this.missing.push("learningRate");
      }

      if(this.missing.length > 0)
        return;

        optimizer = this.modelsService.getOptimizationFunction(this.configuration.getOptimizer(),{
          learningRate:(parseFloat(this.configuration.getLearningRate()))
        });
    }

    const tensorData = this.modelsService.convertToTensors(this.dataLoader.getData(),this.dataLoader.getInputs(),this.dataLoader.getOutputs()[0]);
    const model = this.modelsService.createModel(this.dataLoader.getInputs().length,tensorData.labels.length,this.architectureSetup.getHiddenLayers());
    const xs = tensorData.inputs;
    
    tensorData.outputs.print();
    const ys = tf.oneHot(tensorData.outputs,tensorData.labels.length);
    const trainingLength = Math.floor((this.dataLoader.getTrainingPercentage() / 100) * this.dataLoader.getData().length);

    this.beginTrainingEvent.emit({
      name: this.configuration.getName(),
      model: model,
      xs: xs,
      ys: ys,
      optimizer: optimizer,
      epochs: this.configuration.getEpoch(),
      dataDivider: [trainingLength,this.dataLoader.getData().length - trainingLength],
      labels: tensorData.labels,
      min: Array.from(tensorData.inputMin.dataSync()) ,
      max: Array.from(tensorData.inputMax.dataSync())
    });
    //this.modelsService.train(model,xs,ys,optimizer);
    // const value = tf.tensor2d([123,5,17],[1,3]);
    // value.sub(tensorData.inputMin).div(tensorData.inputMax.sub(tensorData.inputMin));
    // const result = model.predict(value) as tf.Tensor;

    // result.print();

  }
}
