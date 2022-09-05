import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { OnlineStatusService, OnlineStatusType } from 'ngx-online-status';
import { ScriptService } from '../../shared/services/scripts/script.service';
import { downloadScript } from '../../shared/models/scripts/download-script';
import { NotificationComponent } from '../../shared/components/notification/notification.component';
import { StorageService } from '../../shared/services/storage/storage.service';
import { GoogleAuthService } from '../../google-login/GoogleAuth/google-auth.service';

@Component({
  selector: 'board-game-companion-app-download-scripts',
  templateUrl: './download-scripts.component.html',
  styleUrls: ['./download-scripts.component.scss'],
})
export class DownloadScriptsComponent implements OnInit {
  scripts:downloadScript[] = [];
  filter:downloadScript[] = [];
  status: OnlineStatusType = OnlineStatusType.ONLINE;
  page = 1;
  @ViewChild(NotificationComponent,{static:true}) notifications: NotificationComponent = new NotificationComponent();

  constructor(private readonly scriptService:ScriptService,
              private readonly router:Router,
              private networkService: OnlineStatusService,
              private storageService: StorageService,
              private readonly gapi: GoogleAuthService) {
                this.networkService.status.subscribe((status: OnlineStatusType) =>{
                  this.status = status;
                  
                  if(this.status === OnlineStatusType.ONLINE && this.filter.length === this.scripts.length){
                    this.getDownloadScripts();
                  }
                });
              }

  ngOnInit(): void {
    this.getDownloadScripts();
  }

  getDownloadScripts():void{
    
    if(this.status === OnlineStatusType.OFFLINE){
      this.storageService.getAll("downloads").then((value:any) => {
        this.filter = this.scripts = value;
      }).catch(()=>{
        this.notifications.add({type:"danger",message:"Failed to downloaded scripts from local storage."});
      });
      
      return;
    }else if(this.status === OnlineStatusType.ONLINE){
      if(!this.gapi.isLoggedIn()){
        this.storageService.getAll("downloads").then((value:any) => {
          this.filter = this.scripts = value;
        }).catch(()=>{
          this.notifications.add({type:"danger",message:"Failed to downloaded scripts from local storage."});
        });
        
        return;        
      }else{
        this.scriptService.getDownloadScripts().subscribe({
          next: (value: downloadScript[]) => {
            this.filter = this.scripts = value;
          },
          error: (err) => {
            console.log(err)
            this.notifications.add({type:"danger",message:"An error occurred while trying to retrieve the scripts.You can try again later, or contact the developer if the error persists."})
          }
        })  
      }
    }
  }

  search(value:string): void{
    if(value===""){
      this.filter = this.scripts;
      return;
    }

    this.filter = this.scripts.filter((script:downloadScript) => script.name.toLowerCase().indexOf(value.toLowerCase()) !== -1)
  }

  showInfo(value:downloadScript){
    this.router.navigate(['script-detail'], { state: { value: value } });
  }

  play(value:downloadScript): void{
    this.router.navigate(['script-exec'], { state: { value: value } });
  }
}
