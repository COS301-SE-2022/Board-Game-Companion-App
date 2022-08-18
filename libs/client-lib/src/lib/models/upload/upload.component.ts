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
  

  constructor(private readonly modelsService:ModelsService,private readonly storageService:StorageService){}

  ngOnInit(): void{
    console.log("upload")
  }
}
