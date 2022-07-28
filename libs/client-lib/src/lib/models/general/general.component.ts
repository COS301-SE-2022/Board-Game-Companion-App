import { Component, Input, OnInit, OnChanges } from '@angular/core';
import { beginTraining } from '../../shared/models/beginTraining';
import * as tf from '@tensorflow/tfjs';
import { ModelsService } from '../../shared/services/models/models.service';
import { neuralnetwork } from '../../shared/models/neuralnetwork';

@Component({
  selector: 'board-game-companion-app-general',
  templateUrl: './general.component.html',
  styleUrls: ['./general.component.scss'],
  
})
export class GeneralComponent implements OnInit,OnChanges {
  tab = 0;
  @Input()beginTrainingModel!:beginTraining;
  nn:neuralnetwork[] = [];
  months: string[] = ["January","February","March","April","May","June","July","August","September","October","November","December"];

  constructor(private readonly modelService:ModelsService){
    const modelsInfo = localStorage.getItem("models");
    
    if(modelsInfo !== null){
      this.nn = JSON.parse(modelsInfo);
    }
  }

  ngOnInit(): void{
    console.log("models");

  }

  ngOnChanges(): void {
    if(this.beginTrainingModel.name !== ""){
      this.nn.unshift(this.beginTrainingModel);
      this.nn[0].progress = 0;
      this.train();
    }
  }



  async train(){
    const [trainingXs, testingXs] = tf.split(this.beginTrainingModel.xs,this.beginTrainingModel.dataDivider);
    const [trainingYs, testingYs] = tf.split(this.beginTrainingModel.ys,this.beginTrainingModel.dataDivider);

    return await this.modelService.train(this.beginTrainingModel.model,trainingXs,trainingYs,this.beginTrainingModel.optimizer,{
      epochs: this.beginTrainingModel.epochs,
      shuffle: true,

      callbacks:{
        onTrainBegin:()=>{
          console.log(this.nn[0]);
          this.nn[0].progress = 0;
        },
        onTrainEnd:()=>{
          this.nn[0].created = new Date();
          this.nn[0].progress = 100;
          this.nn[0].upload = true;

        },
        onEpochEnd:(epochs,logs)=>{
          const max = this.nn[0].epochs as number;
        
          this.nn[0].progress = Math.floor((epochs / max) * 100);

          if(logs !== undefined)
            this.nn[0].loss = logs['loss'];
        }
      }
    })
  }

  formatDate(value:Date): string{
    const date = new Date(value);
    return date.getDate() + " " + this.months[date.getMonth()] + " " + date.getFullYear();
  }

  changeTab(value:number): void{
    this.tab = value;
  }

  upload(network:neuralnetwork): void{
    network.model?.save('localstorage://' + network.name);
    let modelsInfo = localStorage.getItem('models');
    
    network.upload = false;

    if(modelsInfo === null){
      localStorage.setItem("models",JSON.stringify([network]));
      modelsInfo = localStorage.getItem('models');
    }else{
      localStorage.setItem("models",JSON.stringify(this.nn));
    }

  }

  remove(network:neuralnetwork): void{
    const temp:neuralnetwork[] = [];

    this.nn.forEach((value:neuralnetwork)=>{
      if(value.name !== network.name)
        temp.push(value);
    })

    this.nn = temp;
    localStorage.setItem("models",JSON.stringify(this.nn));
  }
}
