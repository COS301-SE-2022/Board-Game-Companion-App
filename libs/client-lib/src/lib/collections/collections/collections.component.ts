import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { collection } from '../../shared/models/collection/collection';
import { automataScript } from '../../shared/models/scripts/automata-script';
import { downloadScript } from '../../shared/models/scripts/download-script';
import { MostActive } from '../../shared/services/bgg-search/bgg-search.service';
import { BggSearchService } from '../../shared/services/bgg-search/bgg-search.service';
import { CollectionService } from '../../shared/services/collections/collection.service';
import { NotificationComponent } from '../../shared/components/notification/notification.component';
import { OnlineStatusService, OnlineStatusType } from 'ngx-online-status';
import { ScriptService } from '../../shared/services/scripts/script.service';
import { GoogleAuthService } from '../../google-login/GoogleAuth/google-auth.service';
import { ModelsService } from '../../shared/services/models/models.service';
import { StorageService } from '../../shared/services/storage/storage.service';
import * as tf from '@tensorflow/tfjs';


interface Game{
  collectionId: string;
  id: string;
  name: string;
  image: string;
}

@Component({
  selector: 'board-game-companion-app-collections',
  templateUrl: './collections.component.html',
  styleUrls: ['./collections.component.scss'],
})
export class CollectionsComponent implements OnInit {
  games:Game[] = [];
  showGames:Game[] = [];
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
  selectedGame:Game[] = [];
  selectedCollection:collection[] = [];

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
    this.onScreenResize();
  }

  sortScripts(): void{
    for(let count = 0; count < this.scripts.length - 1; count++){
      for(let step = count + 1; step < this.scripts.length; step++){
        if(this.scripts[count].dateReleased < this.scripts[step].dateReleased){
          const temp = this.scripts[count];
          this.scripts[count] = this.scripts[step];
          this.scripts[step] = temp;
        }
      }
    }  
  }

  back(): void{
    if(this.carouselPage === 0)
      return;

    this.carouselPage -= 1;
  }

  next(): void{
    if((this.carouselPage + 1) * this.maxGames >= this.showGames.length)
      return;

    this.carouselPage += 1;
  }

  selectGame(value:Game): void{
    if(this.selectedGame.includes(value))
      this.selectedGame = this.selectedGame.filter((val:Game) => val !== value);
    else
      this.selectedGame.push(value);
    
    this.filterScripts();
  }

  selectCollection(value:collection): void{

    if(this.selectedCollection.includes(value))
      this.selectedCollection = this.selectedCollection.filter((val:collection) => val !== value);
    else
      this.selectedCollection.push(value);

    this.filterScripts();
  }

  filterScripts(): void{
    this.filter = this.scripts;
    this.showGames = this.games;

    if(this.selectedCollection.length !== 0){
      this.selectedCollection.forEach((cval:collection) => {
        this.showGames = this.showGames.filter((gval:Game) => cval.boardgames.includes(gval.id))
      })
    }

    let tempGames = this.showGames;

    if(this.selectedGame.length !== 0){
      tempGames = tempGames.filter((gval:Game) => {
        let result = false;

        for(let count = 0; count < this.selectedGame.length && !result; count++){
          if(gval.id === this.selectedGame[count].id)
            result = true;
        }

        return result;
      })
    }

    this.filter = this.filter.filter((script:automataScript) => {
      let result = false;

      for(let count = 0; count < tempGames.length && !result; count++){
        if(script.boardgame === tempGames[count].id)
          result = true;
      }
      return result;
    })
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

  showGameInfo(value:Game): void{
    this.router.navigate(['board-game-details'], { state: { value: value.id } });
  }

  removeCollection(value:collection): void{
    this.collectionService.removeCollectionById(value._id).subscribe({
      next:(response:number) => {
        if(response === 1){
          this.notifications.add({type:"success",message:`Successfully removed ${value.name}`});
          this.collections = this.collections.filter((val:collection) => val._id !== value._id);
          this.showGames = this.showGames.filter((val:Game) => val.collectionId !== value._id);
          this.games = this.games.filter((val:Game) => val.collectionId !== value._id);
          this.filterScripts();
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
          next:(gvalue) =>{
            const game = this.bggSearch.parseGetBoardGameById(gvalue);
            const temp:Game = {
              collectionId: value._id,
              id: game.id,
              name: game.name,
              image: game.image
            }

            this.games.push(temp);
            this.showGames.push(temp);
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
          this.scripts = this.scripts.concat(...response);
          this.sortScripts();
          this.filter = this.scripts;
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

  checkSearchOnEnter(value:any): void{
    if(value.key === "Enter"){
      value?.preventDefault();
      this.search();
    }
  }

  removeFromCollection(value:Game): void{
    let found = false;
    let temp = this.collections[0];
    console.log(value);

    for(let count = 0; count < this.collections.length && !found; count++){
      console.log(this.collections)
      if(this.collections[count]._id === value.collectionId){
        found = true;
        temp = this.collections[count];
      }
    }

    if(found){
      this.collectionService.removeBoardGame(temp.name,value.id).subscribe({
        next:(response:number) => {
          console.log(response)

          if(response === 1){
            this.notifications.add({type:"success",message:`Successfully removed ${value.name} from ${temp.name}`})
            temp.boardgames = temp.boardgames.filter((val:string) => val !== value.id);
            this.showGames = this.showGames.filter((val:Game) =>{
              if(val.id === value.id){
                if(value.collectionId === temp._id)
                  return false;
              }
              return true;
            });

            this.games = this.games.filter((val:Game) =>{
              if(val.id === value.id){
                if(value.collectionId === temp._id)
                  return false;
              }
              return true;
            });

            this.selectedGame = this.selectedGame.filter((val:Game) => {
              if(val.id === value.id){
                if(value.collectionId === temp._id)
                  return false;
              }
              return true;
            })

            this.filterScripts();

          }else{
            this.notifications.add({type:"warning",message:`Could not find ${value.name} in ${temp.name}`})
          }
        },
        error:()=>{
          this.notifications.add({type:"danger",message:`Failed to remove ${value.name} from ${temp.name}`})
        }
      })
    
    }
  }

  search(): void{
    if(this.searchTerm === "")
      this.filter = this.scripts;
    else
      this.filter = this.scripts.filter((script:automataScript) => script.name.toLowerCase().indexOf(this.searchTerm.toLowerCase()) !== -1)
  }
}