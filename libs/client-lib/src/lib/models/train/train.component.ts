import { Component, EventEmitter, OnInit,Output, ViewChild } from '@angular/core';
import { ModelsService } from '../../shared/services/models/models.service';
import { layer } from '../../shared/models/layer';
import * as tf from '@tensorflow/tfjs'
import { beginTraining } from '../../shared/models/beginTraining';
import { LoadDataComponent } from '../load-data/load-data.component';
import { ArchitectureComponent } from '../architecture/architecture.component';
import { ConfigureComponent } from '../configure/configure.component';
import { NotificationComponent } from '../../shared/components/notification/notification.component';
import { modelData } from '../../shared/models/modelData';
import { StorageService } from '../../shared/services/storage/storage.service';

@Component({
  selector: 'board-game-companion-app-train',
  templateUrl: './train.component.html',
  styleUrls: ['./train.component.scss'],
  
})
export class TrainComponent implements OnInit{
  @Output()trainEvent = new EventEmitter<modelData>();
  @ViewChild(LoadDataComponent,{static:false}) dataLoader: LoadDataComponent = new LoadDataComponent(this.storageService);
  @ViewChild(ArchitectureComponent,{static:false}) architectureSetup: ArchitectureComponent = new ArchitectureComponent();
  @ViewChild(ConfigureComponent,{static:false}) configuration: ConfigureComponent = new ConfigureComponent(this.modelsService);
  @ViewChild(NotificationComponent,{static:true}) notifications: NotificationComponent = new NotificationComponent();
  enableArchitecture = false;
  enableConfigure = false;
  tab = 0;
  step = 0;
  timer = 0;

  constructor(private readonly modelsService:ModelsService,private readonly storageService:StorageService){}

  ngOnInit(): void{
    this.step = 0;
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


  check(value:number): void{
    if(value === 0){
      this.enableArchitecture = (()=>{
        if(this.dataLoader.getData() === null)
          return false;

        if(this.dataLoader.getInputs().length === 0)
          return false;

        if(this.dataLoader.getOutputs().length === 0)
          return false;

        return true;
      })()
    }

    if(value === 1){
      this.enableConfigure = (()=>{
        if(!this.enableArchitecture)
          return false;

        if(this.architectureSetup.getHiddenLayers().length === 0)
          return false;
        
        return true;
      })()
    }
  }

  train(): void{
    const optimizer:tf.Optimizer  = this.modelsService.getOptimizationFunction(this.configuration.getOptimizer(),{
      learningRate: (parseFloat(this.configuration.getLearningRate())),
      decay: (parseFloat(this.configuration.getDecay())),
      epsilon: (parseFloat(this.configuration.getEpsilon())),
      beta1: (parseFloat(this.configuration.getBeta1())),
      beta2: (parseFloat(this.configuration.getBeta2())),
      momentum: (parseFloat(this.configuration.getMomentum())),
      useNesterov: this.configuration.getUseNesterov(),
      centered: this.configuration.getCentered()
    });

    if(!this.dataLoader.preCheckData())
      return;

    this.dataLoader.cleanData();
    
    if(this.dataLoader.getData().length === ""){
      this.notifications.add({type:"warning",message:"No valid training data found."})
      return;
    }

    const tensorData = this.modelsService.convertToTensors(this.dataLoader.getData(),this.dataLoader.getInputs(),this.dataLoader.getOutputs()[0]);
    const model = this.modelsService.createModel(this.dataLoader.getInputs().length,tensorData.labels.length,this.architectureSetup.getHiddenLayers());
    const xs = tensorData.inputs;
    
    const ys = tf.oneHot(tensorData.outputs,tensorData.labels.length);
    const left = Math.ceil((this.dataLoader.getTrainingPercentage() / 100) * this.dataLoader.getData().length);
    const right = this.dataLoader.getData().length - left;
    const dataDivider = [left,right];

    const [trainXs, testXs] = tf.split(xs,dataDivider);
    const [trainYs, testYs] = tf.split(ys,dataDivider);

    this.trainEvent.emit({
      name: this.configuration.getName(),
      model: model,
      type: this.configuration.getType(),
      optimizer: optimizer,
      epochs: this.configuration.getEpoch(),
      trainXs: trainXs,
      trainYs: trainYs,
      testXs: testXs,
      testYs: testYs,
      labels: tensorData.labels,
      min: tensorData.inputMin,
      max: tensorData.inputMax
    });
  }
}
