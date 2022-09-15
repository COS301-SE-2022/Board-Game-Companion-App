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

const games:Game[] = [
  {
    collectionId: "0",
    id: '1234',
    name: "game 1",
    image: "assets/images/logo.png"
  },
  {
    collectionId: "0",
    id: '5678',
    name: "game 2",
    image: "assets/images/logo.png"
  },
  {
    collectionId: "1",
    id: '2345',
    name: "game 3",
    image: "assets/images/logo.png"
  },
  {
    collectionId: "1",
    id: '6789',
    name: "game 4",
    image: "assets/images/logo.png"
  },
  {
    collectionId: "2",
    id: '3456',
    name: "game 5",
    image: "assets/images/logo.png"
  },
  {
    collectionId: "2",
    id: '5678',
    name: "game 2",
    image: "assets/images/logo.png"
  }
]

const collections:collection[] = [
  {
    _id : "0",
    boardgames : ["1234","5678"],
    name: "favourites",
    owner: {name:"Joseph",email:"u18166793@tuks.co.za"}  
  },
  {
    _id : "1",
    boardgames : ["2345","6789"],
    name: "theme-based",
    owner: {name:"Joseph",email:"u18166793@tuks.co.za"}  
  },
  {
    _id : "2",
    boardgames : ["3456","5678"],
    name: "abstract",
    owner: {name:"Joseph",email:"u18166793@tuks.co.za"}  
  }
]

const scripts:automataScript[] = [
  {
    _id : "0",
    name: "mist",
    author:{
      name: "Joseph",
      email: "u18166793@tuks.co.za"
    },
    boardgame: "1234",
    dateReleased: new Date(),
    size: 0,
    version:{
      major: 0,
      minor: 0,
      patch: 0
    },
    previous:[],
    downloads: 0,
    rating: 0,
    export: false,
    lastDownload: new Date(),
    comments: [],
    description: "",
    models: [],
    build: {name:"",key:"",location:""},
    icon: {name:"",key:"",location:"assets/images/logo.png"},
    source: {name:"",key:"",location:""}
  },
  {
    _id : "1",
    name: "gear",
    author:{
      name: "Joseph",
      email: "u18166793@tuks.co.za"
    },
    boardgame: "1234",
    dateReleased: new Date(),
    size: 0,
    version:{
      major: 0,
      minor: 0,
      patch: 0
    },
    previous:[],
    downloads: 0,
    rating: 0,
    export: false,
    lastDownload: new Date(),
    comments: [],
    description: "",
    models: [],
    build: {name:"",key:"",location:""},
    icon: {name:"",key:"",location:"assets/images/logo.png"},
    source: {name:"",key:"",location:""}
  },
  {
    _id : "2",
    name: "cloud",
    author:{
      name: "Joseph",
      email: "u18166793@tuks.co.za"
    },
    boardgame: "5678",
    dateReleased: new Date(),
    size: 0,
    version:{
      major: 0,
      minor: 0,
      patch: 0
    },
    previous:[],
    downloads: 0,
    rating: 0,
    export: false,
    lastDownload: new Date(),
    comments: [],
    description: "",
    models: [],
    build: {name:"",key:"",location:""},
    icon: {name:"",key:"",location:"assets/images/logo.png"},
    source: {name:"",key:"",location:""}
  },
  {
    _id : "3",
    name: "fog",
    author:{
      name: "Joseph",
      email: "u18166793@tuks.co.za"
    },
    boardgame: "2345",
    dateReleased: new Date(),
    size: 0,
    version:{
      major: 0,
      minor: 0,
      patch: 0
    },
    previous:[],
    downloads: 0,
    rating: 0,
    export: false,
    lastDownload: new Date(),
    comments: [],
    description: "",
    models: [],
    build: {name:"",key:"",location:""},
    icon: {name:"",key:"",location:"assets/images/logo.png"},
    source: {name:"",key:"",location:""}
  },
  {
    _id : "4",
    name: "midnight",
    author:{
      name: "Joseph",
      email: "u18166793@tuks.co.za"
    },
    boardgame: "6789",
    dateReleased: new Date(),
    size: 0,
    version:{
      major: 0,
      minor: 0,
      patch: 0
    },
    previous:[],
    downloads: 0,
    rating: 0,
    export: false,
    lastDownload: new Date(),
    comments: [],
    description: "",
    models: [],
    build: {name:"",key:"",location:""},
    icon: {name:"",key:"",location:"assets/images/logo.png"},
    source: {name:"",key:"",location:""}
  },
  {
    _id : "5",
    name: "palm",
    author:{
      name: "Joseph",
      email: "u18166793@tuks.co.za"
    },
    boardgame: "3456",
    dateReleased: new Date(),
    size: 0,
    version:{
      major: 0,
      minor: 0,
      patch: 0
    },
    previous:[],
    downloads: 0,
    rating: 0,
    export: false,
    lastDownload: new Date(),
    comments: [],
    description: "",
    models: [],
    build: {name:"",key:"",location:""},
    icon: {name:"",key:"",location:"assets/images/logo.png"},
    source: {name:"",key:"",location:""}
  },
  {
    _id : "6",
    name: "harem",
    author:{
      name: "Joseph",
      email: "u18166793@tuks.co.za"
    },
    boardgame: "3456",
    dateReleased: new Date(),
    size: 0,
    version:{
      major: 0,
      minor: 0,
      patch: 0
    },
    previous:[],
    downloads: 0,
    rating: 0,
    export: false,
    lastDownload: new Date(),
    comments: [],
    description: "",
    models: [],
    build: {name:"",key:"",location:""},
    icon: {name:"",key:"",location:"assets/images/logo.png"},
    source: {name:"",key:"",location:""}
  }
]

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
    if((this.carouselPage + 1) * this.maxGames >= this.digits.length)
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
            const game = this.bggSearch.parseGetBoardGameById(value);
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

  removeFromCollection(value:Game): void{
    let found = false;

    for(let count = 0; count < this.collections.length && !found; count++){
      if(this.collections[count]._id === value.collectionId){
        found = true;
        this.collections.filter((val:collection) => val._id !== value.collectionId);
      }
    }
  }

  search(): void{
    if(this.searchTerm === "")
      this.filter = this.scripts;
    else
      this.filter = this.scripts.filter((script:automataScript) => script.name.toLowerCase().indexOf(this.searchTerm.toLowerCase()) !== -1)
  }
}