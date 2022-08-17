import { Component, Input, OnInit, OnChanges } from '@angular/core';
import { modelData } from '../../shared/models/modelData';
import * as tf from '@tensorflow/tfjs';
import { ModelsService } from '../../shared/services/models/models.service';
import { neuralnetwork } from '../../shared/models/neuralnetwork';
import { user } from '../../shared/models/user';
import { StorageService } from '../../shared/services/storage/storage.service';

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
  uploadPossible: string[] = []

  constructor(private readonly modelService:ModelsService,private readonly storageService:StorageService){
    const modelsInfo = localStorage.getItem("models");

    if(modelsInfo !== null){
      this.networks = JSON.parse(modelsInfo);
    }
  }

  ngOnInit(): void{
    this.months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
    
    this.storageService.getAll("networks").then((value:any)=>{
      //console.log(value)

      value.forEach((network:any)=>{
        this.networks.push({
          created: network.created,
          accuracy: network.accuracy,
          loss: network.loss,
          setup: {
            labels: network.labels,
            name: network.name,
            type: network.type,
            min: network.min,
            max: network.max
          }
        })
      })
    })
  
  }

  async train(setup:modelData){
    this.networks.unshift({setup:setup});
    this.progress.unshift({
      name: setup.name,
      trainProgress: 0,
      testProgress: 0
    })

    await this.modelService.train(setup.model as tf.Sequential,setup.trainXs as tf.Tensor,setup.trainYs as tf.Tensor,setup.optimizer as tf.Optimizer,{
      epochs: setup.epochs,
      shuffle: true,
      callbacks:{
        onTrainEnd:async()=>{
          for(let count = 0; count < this.networks.length; count++){
            if(this.networks[count].setup.name === setup.name){
              for(let count = 0; count < this.progress.length; count++){
                if(this.progress[count].name === setup.name){
                  const timer = await this.test(this.networks[count],this.progress[count]);
                  clearInterval(timer)
                  break;
                }
              }

              this.networks[count].created = new Date();

              this.storageService.insert("networks",{
                name: this.networks[count].setup.name,
                created: this.networks[count].created,
                loss: this.networks[count].loss,
                accuracy: this.networks[count].accuracy,
                type: this.networks[count].setup.type,
                labels: this.networks[count].setup.labels,
                min: this.networks[count].setup.min.dataSync(),
                max: this.networks[count].setup.max.dataSync()
              });

              await this.networks[count].setup.model?.save('indexeddb://' + this.networks[count].setup.name);

              this.alreadyStored(this.networks[count]);

              break;
            }
          }
        },
        onEpochEnd:(epochs,logs)=>{
          for(let count = 0; count < this.progress.length; count++){
            if(this.progress[count].name === setup.name){
              const max = setup.epochs as number;
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

  async test(network:neuralnetwork,tracker:progressTracker): Promise<number>{
    return new Promise((resolve)=>{
      const len = network.setup.testXs?.shape[0] as number;
      const testXs = network.setup.testXs?.split(len,0) as unknown as tf.Tensor[];
      const testYs = network.setup.testYs?.split(len,0) as unknown as tf.Tensor[];
      let result:tf.Tensor;
      let correct = 0;
      tracker.testProgress = 0;
      let count = 0;

      const timer = window.setInterval(()=>{
        if(count < len){
          result = network.setup.model?.predict(testXs[count]) as tf.Tensor;

          console.log("==============================");
          result.print();
          testYs[count].print();
          console.log("==============================");
          if(result.equal(testYs[count])){
            correct++;
            network.accuracy = (correct / len) * 100;
          }
  
          tracker.testProgress = (count / len) * 100;

          count++;
        }else{
          resolve(timer);
        } 
      },Math.floor(1000/len));
    })
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

  alreadyStored(network:neuralnetwork): void{
    const user:user = {
      name: sessionStorage.getItem("name") as string,
      email: sessionStorage.getItem("email") as string
    }

    this.modelService.alreadyStored(user,network.setup.name).subscribe({
      next:(value:boolean)=>{
        if(!value)
          this.uploadPossible.push(network.setup.name);
      },
      error:(e)=>{
        console.log(e);
      }
    })
  }
}
