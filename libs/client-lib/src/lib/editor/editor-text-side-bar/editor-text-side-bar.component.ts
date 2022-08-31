import { Component, Input, Output, EventEmitter, OnInit, OnChanges, ViewChild } from '@angular/core';
import { script, empty } from '../../shared/models/script';
import { selection } from '../../shared/models/selection';
import { ModelsService } from '../../shared/services/models/models.service';
import { StorageService } from '../../shared/services/storage/storage.service';
import { NotificationComponent } from '../../shared/components/notification/notification.component';
import * as tf from '@tensorflow/tfjs'

@Component({
  selector: 'board-game-companion-app-editor-text-side-bar',
  templateUrl: './editor-text-side-bar.component.html',
  styleUrls: ['./editor-text-side-bar.component.scss'],
})
export class EditorTextSideBarComponent implements OnInit,OnChanges{
  showEntities = true;
  showModels = false;
  models:string[] = [];
  @Input() current:script = empty;
  @Output() selectionEvent = new EventEmitter<selection>();
  @Output() removeEvent = new EventEmitter<selection>();
  @ViewChild(NotificationComponent,{static:true}) notifications: NotificationComponent = new NotificationComponent();

  constructor(private readonly modelService:ModelsService,private readonly storageService:StorageService){}

  ngOnInit(){
    if(this.current._id !== '')
      this.getModels();
  }

  ngOnChanges(){
    this.getModels();
  } 

  highlight(value:selection){
    this.selectionEvent.emit(value);
  }

  remove(value:selection){
    this.removeEvent.emit(value);
  }

  getModels(): void{

    this.modelService.getModels(this.current.models).subscribe({
      next:(value:any) => {
        this.models = value.map((value:any) => value.name);

        this.storageService.clear("networks").then((res:string) => {
          
          value.forEach((network:any) => {
            this.storageService.insert("networks",network).then(async(res:string)=>{
              const model = await tf.loadLayersModel(network.model.location);
              
              await model.save(`indexeddb://${network.name}`);
            }).catch(() =>{
              this.notifications.add({type:"danger",message:`Failed to load model ${network.name}`})
            })
          })

        }).catch(() => {
          this.notifications.add({type:"danger",message:'Failed to clear storage for storing models.'})
        })
      },
      error:(err) => {
        console.log(err);
      }
    })
  }

}
