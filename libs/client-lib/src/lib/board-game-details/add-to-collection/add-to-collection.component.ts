import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
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
export class AddToCollectionComponent implements OnInit,OnDestroy {
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

  ngOnDestroy(): void {
      this.storageService.clear("collections").then(()=>{
        this.options.forEach((value:collection) => {
          this.storageService.insert("collections",value).catch(() => {
            this.notifications.add({type:"danger",message:`Failed to update ${value.name} locally`})
          })
        })
      }).catch(()=>{
        this.notifications.add({type:"warning",message:"Failed to update local collections"})
      })
  }

  loadCollections(): void{
    if(this.status === OnlineStatusType.OFFLINE || !this.gapi.isLoggedIn()){
      this.storageService.getAll("collections").then((value:collection[])=>{
        this.options = value;
      }).catch(() => {
        this.notifications.add({type:"danger",message:"Failed to load local collections."});
      })
    }else{
      this.collectionService.getCollectionsForUser().subscribe({
        next:(response:collection[]) => {
          this.options = response
        },
        error:(err)=>{
          this.notifications.add({type:"danger",message:"Failed to load online collections."});
        }
      })
    }
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
    
    if(this.status === OnlineStatusType.OFFLINE || !this.gapi.isLoggedIn()){
        this.selected.boardgames.push(this.gameId);
        this.notifications.add({type:"success",message:`Successfully added board game to ${this.selected.name}`});
    }else{
      this.collectionService.addGameToCollection(this.selected.name,this.gameId).subscribe({
        next:(value:boolean) => {
          if(value){
            this.notifications.add({type:"success",message:`Successfully added board game to ${this.selected.name}`});
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
}
