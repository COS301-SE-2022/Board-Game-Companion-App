import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { collection } from '../../shared/models/collection/collection';
import { automataScript } from '../../shared/models/scripts/automata-script';
import { downloadScript } from '../../shared/models/scripts/download-script';
import { MostActive as Game } from '../../shared/services/bgg-search/bgg-search.service';
import { BggSearchService } from '../../shared/services/bgg-search/bgg-search.service';
import { CollectionService } from '../../shared/services/collections/collection.service';
import { NotificationComponent } from '../../shared/components/notification/notification.component';
import { OnlineStatusService, OnlineStatusType } from 'ngx-online-status';
import { ScriptService } from '../../shared/services/scripts/script.service';
import { GoogleAuthService } from '../../google-login/GoogleAuth/google-auth.service';
import { ModelsService } from '../../shared/services/models/models.service';
import { StorageService } from '../../shared/services/storage/storage.service';
import * as tf from '@tensorflow/tfjs';

@Component({
  selector: 'board-game-companion-app-collections',
  templateUrl: './collections.component.html',
  styleUrls: ['./collections.component.scss'],
})
export class CollectionsComponent implements OnInit {
  games:Game[] = [];
  collections:collection[] = [];
  scripts:automataScript[] = [];
  filter:automataScript[] = [];
  @ViewChild(NotificationComponent,{static:true}) notifications!: NotificationComponent;
  status: OnlineStatusType = OnlineStatusType.ONLINE;
  page = 1;
  downloading:string[] = [];
  importing:string[] = [];
  downloaded:string[] = [];
  showImports:string[] = []
  searchTerm = "";
  maxGames = 8;
  digits = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18];
  carouselPage = 0;
  widthPerGame = 12;
  selectedGame!:Game;
  selectedCollection!:collection;

  constructor(private readonly bggSearch:BggSearchService,
              private readonly route: ActivatedRoute,
              private readonly router:Router,
              private readonly collectionService:CollectionService,
              private readonly networkService: OnlineStatusService,
              private readonly scriptService: ScriptService,
              private readonly gapi: GoogleAuthService,
              private readonly modelsService: ModelsService,
              private readonly storageService: StorageService){
                this.networkService.status.subscribe((status: OnlineStatusType) =>{
                  this.status = status;
                  
                });
              }

  ngOnInit(): void {
    this.loadCollections();
  }

  back(): void{
    if(this.carouselPage === 0)
      return;

    this.carouselPage -= 1;
  }

  next(): void{
    if((this.carouselPage + 1) * this.maxGames >= this.digits.length)
      return;

    this.carouselPage += 1;
  }

  selectGame(value:Game): void{
    this.selectedGame = value;
    this.filterScripts();
  }

  selectCollection(value:collection): void{
    this.selectedCollection = value;
    this.filterScripts();
  }

  filterScripts(): void{
    this.filter = this.scripts;
    
    if(this.selectedCollection !== undefined){
      this.selectedCollection.boardgames.forEach((id:string) => {
        this.filter = this.filter.filter((script:automataScript) => script.boardgame === id);
      })
    }

    if(this.selectedGame !== undefined){
      this.filter = this.filter.filter((script:automataScript) => script.boardgame === this.selectedGame.id)
    }
  }

  @HostListener('window:resize', ['$event'])
  onScreenResize(): void{
    const width = window.innerWidth;
    
    if(width >= 1200){
      this.maxGames = 10;
      this.widthPerGame = 10;
    }else if(width >= 1000){
      this.maxGames = 8;
      this.widthPerGame = 12;
    }else if(width >= 750){
      this.maxGames = 6;
      this.widthPerGame = 16;
    }else if(width >= 450){
      this.maxGames = 4;
      this.widthPerGame = 24;
    }else{
      this.maxGames = 4;
      this.widthPerGame = 24;
    }
  }

  newCollection(value:collection): void {
    this.collections.push(value);
  }

  removeCollection(value:collection): void{
    this.collectionService.removeCollectionById(value._id).subscribe({
      next:(response:number) => {
        if(response === 1){
          this.notifications.add({type:"success",message:`Successfully removed ${value.name}`});
          this.collections = this.collections.filter((val:collection) => val._id !== value._id)
        }else
          this.notifications.add({type:"warning",message:`Could not find ${value.name} on the server.`});
      },
      error:() =>{
        this.notifications.add({type:"warning",message:`Failed to remove collection '${value.name}'`})        
      }
    })

  }

  loadCollections(): void{
    this.collectionService.getCollectionsForUser().subscribe({
      next:(response:collection[]) => {
        this.collections = response;
        this.loadGames();
        this.loadScripts();
      },
      error:()=>{
        this.notifications.add({type: "warning",message: "Failed to load collections"});
      }
    })
  }

  loadGames(): void{
    this.collections.forEach((value:collection) => {
      value.boardgames.forEach((id:string) => {
        this.bggSearch.getBoardGameById(id).subscribe({
          next:(value) =>{
            console.log(value);
          },
          error:() => {
            this.notifications.add({type: "warning",message: `Failed to load board game of ${value.name}.`});
          }
        })
      })
    })
  }

  loadScripts(): void{
    this.collections.forEach((value:collection) => {
      this.collectionService.getScripts(value._id).subscribe({
        next:(response:automataScript[]) => {  
          this.scripts = response;
        },
        error:() => {
          this.notifications.add({type: "warning",message: `Failed to load the scripts for ${value.name}.`})
        }
      })
    })
  }

  showInfo(value:automataScript){
    this.router.navigate(['script-detail'], { state: { value: value } });
  }

  download(current:automataScript): void{
    if(this.status === OnlineStatusType.OFFLINE){
      this.notifications.add({type:"warning",message:`You must be online to download ${current.name}`});
      return;
    }
    
    if(!this.gapi.isLoggedIn()){
      this.notifications.add({type:"primary",message:`You must be logged In to download ${current.name}`});
      return;
    }

    if(this.downloading.includes(current._id))
      return;

    if(this.downloaded.includes(current._id))
      this.notifications.add({type:"warning",message:`You have already downloaded ${current.name}`})
    else{
        this.downloading.push(current._id);
        this.scriptService.download(current._id).subscribe({
          next:(val:downloadScript)=>{
            if(val === null){
              this.notifications.add({type: "danger",message: `Could not find ${current.name}`})
              this.downloading = this.downloading.filter((id:string) => id !== current._id);
            }

            this.downloaded.push(current._id)
              this.modelsService.getModelsByIdOnly(val.models).subscribe({
                next:(models:any) => {
                  models.forEach((network:any) => {
                    this.storageService.insert("download-networks",network).then(async(res:string) => {
                      const imodel = await tf.loadLayersModel(network.model.location);
                      await imodel.save(`indexeddb://${network.name}`);
                    }).catch(()=> this.notifications.add({type:"warning",message:"something went wrong when loading model"}))
                  })

                  this.storageService.insert("download-scripts",val).then((res:string)=>{
                    this.downloading = this.downloading.filter((id:string) => id !== current._id);
                    this.notifications.add({type:"success",message:`Successfully downloaded ${current.name}`});
                  }).catch(() =>{
                    this.downloading = this.downloading.filter((id:string) => id !== current._id);
                    this.notifications.add({type:"danger",message:"Something went wrong when downloading the script. If this error persists, contact the administrator"})
                  })

                },
                error:(err) => {
                  this.downloading = this.downloading.filter((id:string) => id !== current._id);
                  console.log(err);
                  this.notifications.add({type:"danger",message:"Something went wrong when downloading the script. If this error persists, contact the administrator"})
                }
              })
          },
          error:(err)=>{     
            this.downloading = this.downloading.filter((id:string) => id !== current._id);
            console.log(err);
            this.notifications.add({type:"danger",message:"Something went wrong when downloading the script. If this error persists, contact the administrator"})
          }      
        });
    }
  }

  checkSearchOnEnter(value:any): void{
    if(value.key === "Enter"){
      value?.preventDefault();
      this.search();
    }
  }

  search(): void{
    console.log("search")
  }
}