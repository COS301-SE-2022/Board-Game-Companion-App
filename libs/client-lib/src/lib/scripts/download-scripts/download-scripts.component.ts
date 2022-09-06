import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { OnlineStatusService, OnlineStatusType } from 'ngx-online-status';
import { ScriptService } from '../../shared/services/scripts/script.service';
import { downloadScript } from '../../shared/models/scripts/download-script';
import { NotificationComponent } from '../../shared/components/notification/notification.component';
import { StorageService } from '../../shared/services/storage/storage.service';
import { GoogleAuthService } from '../../google-login/GoogleAuth/google-auth.service';
import { update } from '../../shared/models/scripts/update';
import { ModelsService } from '../../shared/services/models/models.service';
import * as tf from '@tensorflow/tfjs'

@Component({
  selector: 'board-game-companion-app-download-scripts',
  templateUrl: './download-scripts.component.html',
  styleUrls: ['./download-scripts.component.scss'],
})
export class DownloadScriptsComponent implements OnInit {
  scripts:downloadScript[] = [];
  filter:downloadScript[] = [];
  status: OnlineStatusType = OnlineStatusType.ONLINE;
  updating:string[] = []
  updates:update[] = []
  page = 1;
  @ViewChild(NotificationComponent,{static:true}) notifications: NotificationComponent = new NotificationComponent();

  constructor(private readonly scriptService:ScriptService,
              private readonly router:Router,
              private networkService: OnlineStatusService,
              private storageService: StorageService,
              private readonly gapi: GoogleAuthService,
              private readonly modelsService: ModelsService) {
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

  online(): boolean{
    return this.status === OnlineStatusType.ONLINE;
  }

  updateRequired(value:downloadScript): boolean{
    let result = false;

    for(let count = 0; count < this.updates.length && !result; count++){
      if(value._id === this.updates[count].oldId)
        result = true;
    }

    return result;
  }

  removeUpdate(id:string): void{
    const temp:update[] = [];
    
    this.updates.forEach((value:update) =>{
      if(value.oldId  !== id)
        temp.push(value);
    })
  }


  update(value:downloadScript): void{
    this.updates.forEach((val:update) => {
      if(val.oldId === value._id){
        this.updating.push(value._id);

        this.scriptService.updateDownloadedScript(val).subscribe({
          next:(response:downloadScript) => {
            this.storageService.remove("downloads",value.name).then(()=>{
              value.models.forEach((id:string) => {
                this.storageService.remove("networks",id).catch((reason)=> console.error(reason));
              });
  
              this.modelsService.getModelsByIdOnly(response.models).subscribe({
                next:(networks:any) => {
                  networks.forEach((network:any) => {
                    this.storageService.insert("networks",network).then(async(res:string) => {
                      const imodel = await tf.loadLayersModel(network.model.location);
                      await imodel.save(`indexeddb://${network.name}`);
                    }).catch(()=> this.notifications.add({type:"warning",message:"something went wrong when loading model"}))
                  })

                  this.storageService.insert("downloads",response).then((res:string) =>{
                    this.updating = this.updating.filter((id:string) => id != value._id);
                    this.removeUpdate(value._id);
                    this.notifications.add({type:'success',message:`Successfully updated ${response.name}`});
                  }).catch(() => {
                    this.updating = this.updating.filter((id:string) => id != value._id);
                    this.removeUpdate(value._id);
                    this.notifications.add({type:'danger',message:`Something went wrong when updating ${value.name} locally`})
                  })
                },
                error:(err) =>{
                  this.updating = this.updating.filter((id:string) => id != value._id)
                  this.removeUpdate(value._id);
                  this.notifications.add({type:"danger",message:`Failed to retrieve the models of ${value.name}`})
                }
              })
            }).catch(()=>{
              this.updating = this.updating.filter((id:string) => id != value._id)
              this.removeUpdate(value._id);
              this.notifications.add({type:"danger",message:`Failed to update local version of ${value.name}`})
            });
          },
          error:() => {
            this.updating = this.updating.filter((id:string) => id != value._id)
            this.notifications.add({type:"danger",message: `Something went wrong when updating ${value.name}.Try again later and if the error persists, you can contact the administrator`})
          }   
        })
      }
    })
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
            this.checkForUpdates();
          },
          error: (err) => {
            console.log(err)
            this.notifications.add({type:"danger",message:"An error occurred while trying to retrieve the scripts.You can try again later, or contact the developer if the error persists."})
          }
        })  
      }
    }
  }

  checkForUpdates():void{
    this.scripts.forEach((value:downloadScript) => {
      this.scriptService.checkForUpdatesForOne(value.link).subscribe({
        next:(response: string) => {
          this.updates.push({oldId:value._id,newId:response});
          alert(response);
        },
        error:(err)=>{
          console.log(err);
          this.notifications.add({type:"warning",message:"Something went wrong when checking for updates"})
        }
      })
    })
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
