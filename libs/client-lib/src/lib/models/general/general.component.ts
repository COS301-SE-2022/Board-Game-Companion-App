import { Component, Input, OnInit, OnChanges, ViewChild } from '@angular/core';
import { modelData } from '../../shared/models/neuralnetwork/modelData';
import * as tf from '@tensorflow/tfjs';
import { ModelsService } from '../../shared/services/models/models.service';
import { neuralnetwork } from '../../shared/models/neuralnetwork/neuralnetwork';
import { user } from '../../shared/models/general/user';
import { StorageService } from '../../shared/services/storage/storage.service';
import { NotificationComponent } from '../../shared/components/notification/notification.component';

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
  months: string[] = [];
  @ViewChild(NotificationComponent,{static:true}) notifications: NotificationComponent = new NotificationComponent();
  
  constructor(private readonly modelService:ModelsService,private readonly storageService:StorageService){
    const modelsInfo = localStorage.getItem("models");

    if(modelsInfo !== null){
      this.networks = JSON.parse(modelsInfo);
    }
  }

  ngOnInit(): void{
    this.months = ["January","February","March","April","May","June","July","August","September","October","November","December"];

    this.modelService.getAll().subscribe({
      next:(value:any) => {
        value.forEach((sub:any) => {
          this.networks.push({
            created: sub.created,
            loss: sub.loss,
            accuracy: sub.accuracy,
            setup: {
              name: sub.name,
              type: sub.type,
              labels: sub.labels,
              min: tf.tensor(sub.min),
              max: tf.tensor(sub.max)     
            }
          })
        })
      },
      error:(err:any) => {
        console.log(err)
      }
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

              this.upload(this.networks[count]);

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

  remove(network:neuralnetwork): void{

    this.modelService.remove(network.setup.name).subscribe({
      next: (value:boolean) =>{
        if(value){
          this.notifications.add({type:"success",message: `Successfully removed ${network.setup.name}.`})
          this.networks = this.networks.filter((value:neuralnetwork) => value.setup.name !== network.setup.name)
        }else{
          this.notifications.add({type:"warning",message:`Failed to remove ${network.setup.name}`})
        }
      },
      error: (err) => {
        this.notifications.add({type:"danger",message:`Failed to remove ${network.setup.name}.`})
      }
    })
  }

  async upload(network:neuralnetwork): Promise<void>{
    try{
      const user:user = {
        name: sessionStorage.getItem("name") as string,
        email: sessionStorage.getItem("email") as string
      }
      
      const minimum = Array.from(network.setup.min.dataSync());
      const maximum = Array.from(network.setup.max.dataSync());

      network.setup.model?.save(`http://localhost:3333/api/models/create?userName=${user.name}&userEmail=${user.email}&name=${network.setup.name}&created=${network.created?.toString()}&accuracy=${network.accuracy}&loss=${network.loss}&type=${network.setup.type}&labels=${JSON.stringify(network.setup.labels)}&min=${JSON.stringify(minimum)}&max=${JSON.stringify(maximum)}`).
      then((value:tf.io.SaveResult) => {
        this.notifications.add({type:"success",message:`${network.setup.name} was successfully uploaded.`}); 
      }).catch(()=>{
        this.notifications.add({type:"danger",message:`Failed to upload ${network.setup.name}`})
      })
    
    }catch(error){
      this.notifications.add({type:"danger",message:`Failed to upload model '${network.setup.name}'. Could not find in local storage`})
    }
  }
}
