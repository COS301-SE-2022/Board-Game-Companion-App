import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OnlineStatusService, OnlineStatusType } from 'ngx-online-status';
import { GoogleAuthService } from '../../google-login/GoogleAuth/google-auth.service';
import { NotificationComponent } from '../../shared/components/notification/notification.component';
import { collection } from '../../shared/models/collection/collection';
import { CollectionService } from '../../shared/services/collections/collection.service';
import { StorageService } from '../../shared/services/storage/storage.service';
@Component({
  selector: 'board-game-companion-app-add-to-collection',
  templateUrl: './add-to-collection.component.html',
  styleUrls: ['./add-to-collection.component.scss'],
})
export class AddToCollectionComponent implements OnInit {
  options:collection[] = [];
  selected!:collection;
  status: OnlineStatusType = OnlineStatusType.ONLINE;
  @Input()gameId!:string;
  @ViewChild(NotificationComponent,{static:true}) notifications: NotificationComponent = new NotificationComponent();

  constructor(private readonly router:Router,
              private readonly route: ActivatedRoute,
              private networkService: OnlineStatusService,
              private readonly gapi: GoogleAuthService,
              private readonly collectionService:CollectionService,
              private readonly storageService:StorageService){
                this.networkService.status.subscribe((status: OnlineStatusType) =>{
                  this.status = status;
                  
                });
              }

  ngOnInit(): void {
    this.loadCollections();
  }

  loadCollections(): void{
    if(this.status === OnlineStatusType.OFFLINE){
      return;
    }

    if(!this.gapi.isLoggedIn()){
      return;
    }

    this.collectionService.getCollectionsForUser().subscribe({
      next:(response:collection[]) => {
        this.options = response
      },
      error:(err)=>{
        console.log(err)
      }
    })
  }

  add(): void{
    if(this.selected === undefined){
      this.notifications.add({type:"danger",message:"Collection not selected."})
      return;
    }

    if(this.selected.boardgames.includes(this.gameId)){
      this.notifications.add({type:"warning",message:`${this.selected.name} already contains this board game.`});
      return;
    }
    
    if(this.status === OnlineStatusType.OFFLINE){
      this.notifications.add({type:"warning",message:`You must be online to add board game to ${this.selected.name}.`})
      return;
    }

    if(!this.gapi.isLoggedIn()){
      this.notifications.add({type:"warning",message:`You must be logged in to add board game to ${this.selected.name}.`})
      return;
    }

    this.collectionService.addGameToCollection(this.selected.name,this.gameId).subscribe({
      next:(value:boolean) => {
        if(value){
          this.storageService.getByIndex("collections","name",this.selected.name).then((response:any)=>{
            this.storageService.remove("collections","name",this.selected.name).then(()=>{
              response.boardgames.push(this.gameId);
              this.storageService.insert("collections",response).then(()=>{
                this.notifications.add({type:"success",message:`Successfully added board game to ${this.selected.name}`});
              }).catch(()=>{
                this.notifications.add({type:"danger",message:`Failed to update ${this.selected.name} locally`});
              }) 
            }).catch(()=>{
              this.notifications.add({type:"danger",message:`Failed to update ${this.selected.name} locally`});
            })
          }).catch(()=>{
            this.notifications.add({type:"danger",message:`Failed to update ${this.selected.name} locally`});
          })
        }else{
          this.notifications.add({type:"danger",message:`Failed to add board game to ${this.selected.name}`});
        }
      },
      error:()=>{
        this.notifications.add({type:"danger",message:`Something went wrong when adding boardgame to collection ${this.selected.name}. Try again later and if the error persists you can contact the developer`});
      }  
    })
  }
}
