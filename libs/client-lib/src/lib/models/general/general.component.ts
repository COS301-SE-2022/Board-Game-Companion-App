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
  loss: number;
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
  training: string[] = [];
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
      next:(value:neuralnetwork[]) => {
        this.networks = value;
      },
      error:() => {
        this.notifications.add({type:"danger",message:"Failed to load models"})
      }
    })
  }

  async train(setup:modelData){
    const current:neuralnetwork = {
      _id: "",
      name: setup.name,
      created: new Date(),
      labels: setup.labels,
      max: Array.from(setup.max.dataSync()),
      min: Array.from(setup.min.dataSync()),
      loss: 0,
      accuracy: 0      
    };

    this.networks.unshift(current);

    this.progress.unshift({
      name: setup.name,
      trainProgress: 0,
      loss: 0
    })

    let tuningRequired = false;
    let loss = 0;

    const trainYs = tf.oneHot(setup.trainYs as tf.Tensor,setup.labels.length);
    this.training.push(setup.name);
    
    this.modelService.train(setup.model as tf.Sequential,setup.trainXs as tf.Tensor,trainYs,setup.optimizer as tf.Optimizer,{
      epochs: setup.epochs,
      shuffle: true,
      callbacks:{
        onTrainEnd:async() => {
          this.progress = this.progress.filter((value) => value.name !== setup.name);
          this.training = this.training.filter((name:string) => name !== setup.name)
          current.accuracy = this.test(setup.model as tf.Sequential,setup);
          current.loss = loss;

          if(!isNaN(current.loss))
            this.upload(current,setup.model as tf.Sequential);
        },
        onEpochEnd:async(epochs,logs) => {
          for(let count = 0; count < this.progress.length; count++){
            if(this.progress[count].name === setup.name){
              const max = setup.epochs as number;
              this.progress[count].trainProgress = Math.ceil((epochs / max) * 100);
              loss = (logs as tf.Logs)['loss'];

              if(isNaN((logs as tf.Logs)['loss']) && !tuningRequired){
                this.notifications.add({type:"danger",message:"Parameter tuning required."})
                tuningRequired = true;
              }

              break;
            }
          }
        }
      }
    });
  }

  test(model:tf.Sequential,setup:modelData): number{
    const xs = setup.testXs as tf.Tensor;

    const result = model.predict(xs) as tf.Tensor;

    result.print();
    result.argMax(1).print();
    const prediction = Array.from(result.argMax(1).dataSync());

    let correct = 0;
    const ys = Array.from((setup.testYs as tf.Tensor).dataSync());
    
    for(let count = 0; count < ys.length; count++){
  
      if(prediction[count] === ys[count])
        correct++;
    }

    return (correct / ys.length) * 100;
  }

  formatDate(value:Date): string{
    const date = new Date(value);
    return date.getDate() + " " + this.months[date.getMonth()] + " " + date.getFullYear();
  }

  remove(network:neuralnetwork): void{

    if(!isNaN(network.loss)){
      this.modelService.remove(network._id).subscribe({
        next: (value:boolean) =>{
          if(value){
            this.notifications.add({type:"success",message: `Successfully removed ${network.name}.`})
            this.networks = this.networks.filter((value:neuralnetwork) => value._id !== network._id)
          }else{
            this.notifications.add({type:"warning",message:`Failed to remove ${network.name}`})
          }
        },
        error: () => {
          this.notifications.add({type:"danger",message:`Failed to remove ${network.name}.`})
        }
      })
    }else{
      this.notifications.add({type:"success",message: `Successfully removed ${network.name}.`})
      this.networks = this.networks.filter((value:neuralnetwork) => value._id !== network._id)
    }
  }

  getProgress(name:string): number{
    
    for(let count = 0; count < this.progress.length; count++){
      if(this.progress[count].name === name){
        return this.progress[count].trainProgress;
      }
    }

    return 100;
  }


  async upload(network:neuralnetwork,model:tf.Sequential): Promise<void>{
    try{
      const user:user = {
        name: sessionStorage.getItem("name") as string,
        email: sessionStorage.getItem("email") as string
      }
      
      const minimum = network.min;
      const maximum = network.max;
      
      model.save(`https://board-game-companion-app.herokuapp.com/api/models/create?userName=${user.name}&userEmail=${user.email}&name=${network.name}&created=${network.created?.toString()}&labels=${JSON.stringify(network.labels)}&min=${JSON.stringify(minimum)}&max=${JSON.stringify(maximum)}&loss=${network.loss}&accuracy=${network.accuracy}`).
      then((value:tf.io.SaveResult) => {
        (value.responses as Response[])[0].json().then((res) => {
          network._id = res._id;
        })

        this.notifications.add({type:"success",message:`${network.name} was successfully uploaded.`}); 
      }).catch(()=>{
        this.notifications.add({type:"danger",message:`Failed to upload ${network.name}`})
      })
    
    }catch(error){
      this.notifications.add({type:"danger",message:`Failed to upload model '${network.name}'. Could not find in local storage`})
    }
  }
}
