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
}
