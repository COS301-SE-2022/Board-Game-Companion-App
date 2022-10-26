import { Component, OnInit, ViewChild, Input, HostListener } from '@angular/core';
import { ScriptService } from '../../shared/services/scripts/script.service';
import { script, empty } from '../../shared/models/scripts/script';
import { Router } from '@angular/router';
import { myScript } from '../../shared/models/scripts/my-script';
import { automataScript } from '../../shared/models/scripts/automata-script';
import { OnlineStatusService, OnlineStatusType } from 'ngx-online-status';
import { GoogleAuthService } from '../../google-login/GoogleAuth/google-auth.service';
import { NotificationComponent } from '../../shared/components/notification/notification.component';
import { BggSearchService } from '../../shared/services/bgg-search/bgg-search.service';
import { version } from '../../shared/models/scripts/version';


@Component({
  selector: 'board-game-companion-app-my-scripts',
  templateUrl: './my-scripts.component.html',
  styleUrls: ['./my-scripts.component.scss'],
})
export class MyScriptsComponent implements OnInit{
  myScripts:script[] = [];
  myCurrentScript:script = empty;
  scripts:myScript[] = [];
  filter:myScript[] = [];
  status: OnlineStatusType = OnlineStatusType.ONLINE;
  showOffline = false;
  page = 1;
  @Input()gridView = true;
  updates:string[] = [];
  releasing:string[] = [];
  months: string[] = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  boardGameName = "";
  width = window.innerWidth;
  currentRelease!:myScript;
  version:version = {major: 0, minor: 0, patch: 0}
  loading = false;
  countLoads = 0;
  maxOfPage = 8;

  @ViewChild(NotificationComponent,{static:true}) notifications: NotificationComponent = new NotificationComponent();


  constructor(private readonly scriptService:ScriptService,
              private readonly router:Router,
              private readonly networkService: OnlineStatusService,
              private readonly gapi: GoogleAuthService,
              private readonly boardGameService:BggSearchService
              ){
                this.networkService.status.subscribe((status: OnlineStatusType) =>{
                  this.status = status;
                  
                  if(this.status === OnlineStatusType.ONLINE && this.filter.length === this.scripts.length){
                    this.showOffline = false;
                    this.getMyScripts();
                  }


                  if(this.status === OnlineStatusType.OFFLINE){
                    this.showOffline = true;                    
                  }
                });
  }

  ngOnInit(): void {
    this.getMyScripts();
    this.onScreenResize();
    this.changePage(1);
  }

  getMyScripts():void{
    if(this.status === OnlineStatusType.OFFLINE){
      return;
    }

    if(!this.gapi.isLoggedIn()){
      this.notifications.add({type:"primary",message:"You must be logged In to view your scripts."});
      return;
    }

    this.loading = true;
    this.countLoads = 0;

    this.scriptService.getScriptsCreatedByMe().subscribe({
      next: (value: myScript[]) => {
        this.filter = this.scripts = value;
      },
      error: () => {
        this.loading = false;
        this.notifications.add({type:"danger",message:"An error occurred while trying to retrieve your scripts.You can try again later, or contact the developer if the error persists."})
      }
    })  
  }

  newScript(value:myScript): void{
    this.scripts.push(value);
    this.filter = this.scripts;
  }

  done(): void{
    this.countLoads++;
    console.log("count: " + this.countLoads);

    if(this.countLoads === this.filter.length || this.countLoads === this.maxOfPage)
      this.loading = false;
  }

  search(value:string): void{

    if(value===""){
      this.filter = this.scripts;
      return;
    }

    this.filter = this.scripts.filter((script:myScript) => script.name.toLowerCase().indexOf(value.toLowerCase()) !== -1)
  }

  showVersionPopup(value:myScript){
    this.currentRelease = value;
    this.version = {
      major: value.version.major,
      minor: value.version.minor,
      patch: value.version.patch
    };
  }


  remove(current:myScript):void{
    this.scriptService.removeMyScript(current._id).subscribe({
      next:() => {
        this.notifications.add({type:"success",message:`Successfully deleted ${current.name}`});
        this.scripts = this.scripts.filter((value:myScript) => value._id !== current._id)
        this.filter = this.filter.filter((value:myScript) => value._id !== current._id)
      },
      error:() => {
        this.notifications.add({type:"danger",message:`Failed to delete ${current.name}`});
      }
    })
  }

  update(value:myScript): void{

    if(this.status === OnlineStatusType.OFFLINE){
      this.notifications.add({type:"warning",message:"Can not update script when offline"})
      return;
    } 

    this.updates.push(value._id);

    this.scriptService.update(value._id,value.export,value.description).subscribe({
      next:(val:myScript) => {
        this.notifications.add({type:"success",message:`Successfully updated ${val.name}.`});
        this.updates = this.updates.filter((id:string) => id !== val._id);
      },
      error:() =>{
        this.notifications.add({type:"danger",message:`Something went wrong when updating ${value.name}.Update script later or contact administrator if error persists.`});
        this.updates = this.updates.filter((id:string) => id !== value._id);
      }
    })
  }

  checkVersion(oldVersion:version,newVersion:version): boolean{
    let result = true;

    if(newVersion.major < oldVersion.major){
      result = false;
    }else if(newVersion.major === oldVersion.major){
      if(newVersion.minor < oldVersion.minor){
        result = false;
      }else if(newVersion.minor === oldVersion.minor){
        if(newVersion.patch <= oldVersion.patch)
          result = false;
      }
    }

    return result;
  }

  release(script:myScript): void{
    if(this.status === OnlineStatusType.OFFLINE){
      this.notifications.add({type: "warning",message: `Can not ${script.name} when offline`})
      return;
    }

    switch(script.status.value){
      case 0:{
        this.notifications.add({type: "danger",message: `${script.name} has been flagged.`})
      }break;
      case 1:{
        if(this.checkVersion(script.version,this.version)){
          this.releasing.push(script.name);

          this.scriptService.release(script._id,this.version).subscribe({
            next:(value) => {
                if(value.success){ 
                  script.version = {
                    major: value.content?.version.major as number,
                    minor: value.content?.version.minor as number,
                    patch: value.content?.version.patch as number
                  }
                  script.status.value = 2;
                  this.notifications.add({type:"success",message:`${value.content?.name} was successfully released.`})
                }else{
                  this.notifications.add({type:"warning",message:value.message as string});
                }

                this.releasing = this.releasing.filter((value:string) => value !== script.name);
              },
            error:() => {
              this.releasing = this.releasing.filter((value:string) => value !== script.name);
              this.notifications.add({type:"danger",message:`Something went wrong when releasing the ${script.name}.Try again later or contact administrator if this error persists.`})
            }
          });
        }else
          this.notifications.add({type: "warning",message: "The new version must be greater than the current version."})
      }break;
      case 2:{
        this.notifications.add({type: "danger",message: `${script.name} has already been released.`})
      }break;
    }
  }

  getBoardGameName(value:myScript):void{
    this.boardGameService.getBoardGameById(value.boardgame).subscribe({
      next:(val)=>{
        this.boardGameName = this.boardGameService.parseGetBoardGameById(val.toString()).name;
      },
      error:(err)=>{
        console.log(err);
      }
    });
  }

  convertBytes(value:number): string{
    const decimals = 2;
    const kilo = 1024;
    const deci = decimals < 0 ? 0 : decimals;
    const ranges = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    if(value === 0)
      return '0 B';
    const i = Math.floor(Math.log(value) / Math.log(kilo));

    return parseFloat((value / Math.pow(kilo, i)).toFixed(deci)) + ' ' + ranges[i];
  }

  formatDate(date:Date):string{
    let result = "";
    
    const val = new Date(date);

    result = (val.getDate() < 10 ? "0": "") + val.getDate() + " ";
    result += this.months[val.getMonth()] + " ";
    result += val.getFullYear() + ", ";
    result += (val.getHours() < 10 ? "0" : "") + val.getHours() + ":" + (val.getMinutes() < 10 ? "0" : "") + val.getMinutes() + ":" + (val.getSeconds() < 10 ? "0" : "") + val.getSeconds();

    return result;
  }

  showInfo(value:myScript){
    this.scriptService.getMyScriptInfo(value._id).subscribe({
      next:(response:automataScript) => {
        this.router.navigate(['script-detail'], { state: { value: response } });
      },
      error:()=>{
        this.notifications.add({type:"danger",message:`Could not find the release version of ${value.name}`})
      }
    });
  }

  
  @HostListener('window:resize', ['$event'])
  onScreenResize(): void{
    this.width = window.innerWidth;
  }
  

  isMobileOS(): boolean{
    if(navigator.userAgent.indexOf("Android") != -1)
      return true;

    if(navigator.userAgent.indexOf("iPhone") != -1)
      return true;

    if(window.screen.width < 800)
      return true;

    return false;
  }
  
  showEditor(value:myScript){
    this.router.navigate(['editor'],{ state: { value: value } });
  }

  play(value:myScript): void{
    this.router.navigate(['script-exec'], { state: { value: value } });
  }

  changePage(newPage:number): void{
    this.page = newPage;
    const temp = Math.ceil(this.filter.length / 8 )
    const mod = this.filter.length % 8;
    
    if(temp === newPage){
      if(mod === 0){
        this.maxOfPage = 8;
      }else
        this.maxOfPage = mod;
    }else
      this.maxOfPage = 8;

    this.loading = true;
    this.countLoads = 0;
  }
}
