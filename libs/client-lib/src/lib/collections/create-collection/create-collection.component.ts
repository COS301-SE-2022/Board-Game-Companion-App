import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { NotificationComponent } from '../../shared/components/notification/notification.component';
import { collection } from '../../shared/models/collection/collection';
import { CollectionService } from '../../shared/services/collections/collection.service';
import { GoogleAuthService } from '../../google-login/GoogleAuth/google-auth.service';
import { OnlineStatusService, OnlineStatusType } from 'ngx-online-status';
import { StorageService } from '../../shared/services/storage/storage.service';

@Component({
  selector: 'board-game-companion-app-create-collection',
  templateUrl: './create-collection.component.html',
  styleUrls: ['./create-collection.component.scss'],
})
export class CreateCollectionComponent implements OnInit {
  name = "";
  @Output()createCollectionEvent = new EventEmitter<collection>();
  @ViewChild(NotificationComponent,{static:true}) notifications!: NotificationComponent;
  status: OnlineStatusType = OnlineStatusType.ONLINE;

  constructor(private readonly collectionService:CollectionService,
              private readonly gapi:GoogleAuthService,
              private readonly networkService: OnlineStatusService,
              private readonly storageService: StorageService){
                this.networkService.status.subscribe((status: OnlineStatusType) =>{
                  this.status = status;
                });
              }

  ngOnInit(): void {
    console.log("create script");      
  }  

  save(): void{
    if(this.status === OnlineStatusType.ONLINE && this.gapi.isLoggedIn()){
      this.collectionService.alreadyExists(this.name.toLowerCase()).subscribe({
        next:(value:boolean) => {
          if(value)
            this.notifications.add({type:"danger",message:`${this.name} already exists.`})
          else{
            this.collectionService.createCollection(this.name.toLowerCase()).subscribe({
              next:(value:collection) => {
                this.createCollectionEvent.emit(value);
                this.notifications.add({type:"success",message:`Successfully created collection ${value.name}`});
              },
              error:() => {
                this.notifications.add({type:"danger",message:`Failed to create collection ${this.name}`});
              }
            })
          }
        },
        error:() => {
          this.notifications.add({type:"danger",message:"Somethings went wrong when creating collection. Try again later or contact the administrator if the error persists."});
        }
      })
    }else{
      const temp:collection = {
        _id: "",
        name: this.name,
        boardgames: [],
        owner: {name: "",email:""}
      }
      this.storageService.insert("collections",temp).then(() => {
        this.createCollectionEvent.emit(temp);
        this.notifications.add({type:"success",message:`Successfully created collection ${temp.name}`});
      }).catch(() => {
        this.notifications.add({type:"danger",message:"Failed to create collection"})
      })
    } 
  }

  checkOnEnter(value:any): void{
    if(value.key === "Enter"){
      value?.preventDefault();
      document.getElementById("save-collection")?.click();
    }
  }
}
