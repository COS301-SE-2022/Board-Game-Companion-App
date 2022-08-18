import { Component, EventEmitter, OnInit,Output, ViewChild } from '@angular/core';
import { ModelsService } from '../../shared/services/models/models.service';
import * as tf from '@tensorflow/tfjs'
import { NotificationComponent } from '../../shared/components/notification/notification.component';
import { modelData } from '../../shared/models/modelData';
import { StorageService } from '../../shared/services/storage/storage.service';
import { user } from '../../shared/models/user';

@Component({
  selector: 'board-game-companion-app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss'],
  
})
export class UploadComponent implements OnInit{
  @ViewChild(NotificationComponent,{static:true}) notifications: NotificationComponent = new NotificationComponent();
  name = "";  
  location = 0;
  type = "classification"
  label = "";
  path = "";
  labels:string[] = []

  constructor(private readonly modelsService:ModelsService,private readonly storageService:StorageService){}

  ngOnInit(): void{
    this.name = "";
  }

  changeLocation(value:number): void{
    this.location = value;
  }

  checkInputOnEnter(value:any): void{

    if(value.key === "Enter"){
      value?.preventDefault();
      this.addLabel();
    }
  }

  addLabel(): void{
    if(this.label !== ""){
      if(!this.alreadyExists(this.label)){
        this.labels.push(this.label);
      }else
        this.notifications.add({type:'warning',message:'Duplicate label not allowed.'});

      this.label = "";
    }else
      this.notifications.add({type:'warning',message:'Can not use empty label.'});
  }

  alreadyExists(value:string): boolean{
    let result = false;

    for(let count = 0; count < this.labels.length && !result; count++){
      if(this.labels[count] === value)
        result = true;
    }

    return result;
  }

  removeInput(value:string): void{
    const temp:string[] = [];

    for(let count = 0; count < this.labels.length; count++){
      if(value!== this.labels[count])
        temp.push(this.labels[count]);
    }

    this.labels = temp; 
  }

  upload(): void{
    if(this.name === ""){
      this.notifications.add({type: "danger", message: "The name of the neural network is missing."});
      return;
    }

    if(this.path === ""){
      this.notifications.add({type: "danger", message: "The path to the models is missing."});
      return;
    }

    if(this.type === "classification" && this.labels.length === 0){
      this.notifications.add({type: "danger", message: "Classification model does not have any labels."});
      return;
    }

    switch(this.location){
      case 0:{
        tf.loadLayersModel(this.path).then((value:tf.LayersModel) => {
          const user:user = {
            name: sessionStorage.getItem("name") as string,
            email: sessionStorage.getItem("email") as string
          }

          let temp = "";

          if(this.labels.length !== 0){
            temp = "&labels=" + JSON.stringify(this.labels);
          }

          value.save(`http://localhost:3333/api/models/create?userName=${user.name}&userEmail=${user.email}&name=${this.name}&created=${(new Date()).toString()}&type=${this.type}${temp}`).then((value:tf.io.SaveResult)=>{
            this.notifications.add({type: "success",message: "Successfully uploaded model."});
          }).catch((reason:any)=>{
            this.notifications.add({type:"danger",message:"Failed to upload model"})
          })

        }).catch((reason:any) => {
          this.notifications.add({type: "danger", message: "Failed to load model."})
        })
      }break;
      case 1:{
        tf.loadLayersModel(`indexeddb://${this.path}`).then((value:tf.LayersModel) => {
          const user:user = {
            name: sessionStorage.getItem("name") as string,
            email: sessionStorage.getItem("email") as string
          }

          let temp = "";

          if(this.labels.length !== 0){
            temp = "&labels=" + JSON.stringify(this.labels);
          }

          value.save(`http://localhost:3333/api/models/create?userName=${user.name}&userEmail=${user.email}&name=${this.name}&created=${(new Date()).toString()}&type=${this.type}${temp}`).then((value:tf.io.SaveResult)=>{
            this.notifications.add({type: "success",message: "Successfully uploaded model."});
          }).catch((reason:any)=>{
            this.notifications.add({type:"danger",message:"Failed to upload model"})
          })
          
        }).catch((reason:any) => {
          this.notifications.add({type: "danger", message: "Failed to load model."})
        })
      }break;
      case 2:{
        tf.loadLayersModel(`localstorage://${this.path}`).then((value:tf.LayersModel) => {
          const user:user = {
            name: sessionStorage.getItem("name") as string,
            email: sessionStorage.getItem("email") as string
          }

          let temp = "";

          if(this.labels.length !== 0){
            temp = "&labels=" + JSON.stringify(this.labels);
          }

          value.save(`http://localhost:3333/api/models/create?userName=${user.name}&userEmail=${user.email}&name=${this.name}&created=${(new Date()).toString()}&type=${this.type}${temp}`).then((value:tf.io.SaveResult)=>{
            this.notifications.add({type: "success",message: "Successfully uploaded model."});
          }).catch((reason:any)=>{
            this.notifications.add({type:"danger",message:"Failed to upload model"})
          })
          
          
        }).catch((reason:any) => {
          this.notifications.add({type: "danger", message: "Failed to load model."})
        })
      }break;
    }
  }
}
