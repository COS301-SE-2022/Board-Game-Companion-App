import { Component, Input, OnInit, OnChanges } from '@angular/core';
import { modelData } from '../../shared/models/modelData';
import * as tf from '@tensorflow/tfjs';
import { ModelsService } from '../../shared/services/models/models.service';
import { neuralnetwork } from '../../shared/models/neuralnetwork';

interface progressTracker{
  name: string;
  trainProgress: number;
  testProgress: number;
}

@Component({
  selector: 'board-game-companion-app-general',
  templateUrl: './general.component.html',
  styleUrls: ['./general.component.scss'],
  
})
export class GeneralComponent implements OnInit {
  networks:neuralnetwork[] = [];
  progress:progressTracker[] = [];
  months: string[] = []

  constructor(private readonly modelService:ModelsService){
    const modelsInfo = localStorage.getItem("models");
    
    if(modelsInfo !== null){
      this.networks = JSON.parse(modelsInfo);
    }
  }

  ngOnInit(): void{
    this.months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  }

  async train(setup:modelData){
    this.networks.unshift({setup:setup});
    this.progress.unshift({
      name: setup.name,
      trainProgress: 0,
      testProgress: 0
    })

    return await this.modelService.train(setup.model,setup.trainXs,setup.trainYs,setup.optimizer,{
      epochs: setup.epochs,
      shuffle: true,

      callbacks:{
        onTrainEnd:()=>{
          for(let count = 0; count < this.networks.length; count++){
            if(this.networks[count].setup.name === setup.name){
              this.networks[count].created = new Date();
              this.networks[count].upload = true;
              break;
            }
          }

          // for(let count = 0; count < this.progress.length; count++){
          //   if(this.progress[count].name === setup.name){
          //     this.progress 
          //   }
          // }
        },
        onEpochEnd:(epochs,logs)=>{
          for(let count = 0; count < this.progress.length; count++){
            if(this.progress[count].name === setup.name){
              const max = setup.epochs;
              this.progress[count].trainProgress = Math.ceil((epochs / max) * 100);
              break;
            }
          }

          for(let count = 0; count < this.networks.length; count++){
            if(this.networks[count].setup.name === setup.name){
              if(logs !== undefined)
                this.networks[count].loss = logs['loss'];
              
              break;
            }
          }
        }
      }
    })
  }

  formatDate(value:Date): string{
    const date = new Date(value);
    return date.getDate() + " " + this.months[date.getMonth()] + " " + date.getFullYear();
  }

  getProgress(name:string,sub:string):number{
    let result = 0;

    for(let count = 0; count < this.progress.length; count++){
      if(this.progress[count].name === name){
        result = this.progress[count][(sub === "train" ? "trainProgress":"testProgress")];
      }
    }
    
    return result;
  }
}
