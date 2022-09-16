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
import { oldScript } from '../../shared/models/scripts/old-script';

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
  updatesRequired:string[] = []
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
            this.storageService.remove("download-networks","_id",value._id).then(()=>{
              value.models.forEach((id:string) => {
                this.storageService.remove("networks","_id",id).catch((reason)=> console.error(reason));
              });
  
              this.modelsService.getModelsByIdOnly(response.models).subscribe({
                next:(networks:any) => {
                  networks.forEach((network:any) => {
                    this.storageService.insert("download-networks",network).then(async(res:string) => {
                      const imodel = await tf.loadLayersModel(network.model.location);
                      await imodel.save(`indexeddb://${network.name}`);
                    }).catch(()=> this.notifications.add({type:"warning",message:"something went wrong when loading model"}))
                  })

                  this.storageService.insert("download-scripts",response).then((res:string) =>{
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
      this.storageService.getAll("download-scripts").then((value:any) => {
        this.filter = this.scripts = value;
      }).catch(()=>{
        this.notifications.add({type:"danger",message:"Failed to downloaded scripts from local storage."});
      });
      
      return;
    }else if(this.status === OnlineStatusType.ONLINE){
      if(!this.gapi.isLoggedIn()){
        this.storageService.getAll("download-scripts").then((value:any) => {
          this.filter = this.scripts = value;
        }).catch(()=>{
          this.notifications.add({type:"danger",message:"Failed to downloaded scripts from local storage."});
        });
        
        return;        
      }else{
        this.scriptService.getDownloadScripts().subscribe({
          next: (value: downloadScript[]) => {
            this.filter = this.scripts = value;
            
            this.storageService.clear("download-scripts").then(()=>{
              this.storageService.clear("download-networks")
            })

            this.scripts.forEach((script:downloadScript) => {
              this.storageService.insert("download-scripts",script).then(()=>{
                this.modelsService.getModelsByIdOnly(script.models).subscribe({
                  next:(networks:any) => {
                    networks.forEach((network:any)=>{
                      this.storageService.insert("download-networks",network).then(()=>{
                        tf.loadLayersModel(network.model.location).then((model:tf.LayersModel) =>{
                          model.save(`indexeddb://${network.name}`)
                        }).catch(()=>{
                          this.notifications.add({type:"warning",message:`One of the models of ${script.name} failed to load properly`})
                        })
                      }).catch(()=>{
                        this.notifications.add({type:"warning",message:`Failed to load one of the models that belong to ${script.name}`})
                      })
                    })
                  },
                  error:()=>{
                    this.notifications.add({type:"danger",message:"Failed to load models locally"});
                  }
                })
              }).catch(()=>{
                this.notifications.add({type:"warning",message:`Failed to load ${script.name} locally.`});
              })
            })

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
          if(response !== "" && response !== null){
            this.updates.push({oldId:value._id,newId:response});
            this.updatesRequired.push(value._id);
          } 
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

  showInfo(script:downloadScript){
    this.scriptService.getDownloadInfo(script.link).subscribe({
      next:(value:downloadScript | oldScript) =>{
        if(value === null)
          this.notifications.add({type:"primary",message:`Could not find the information of ${script.name}`})
        else
          this.router.navigate(['script-detail'], { state: { value: value } });
      },
      error:() => {
        this.notifications.add({type:"warning",message:`Something went wrong when retrieving the information of ${script.name}`});
      }
    })
    
  }

  play(value:downloadScript): void{
    this.router.navigate(['script-exec'], { state: { value: value } });
  }

  remove(script:downloadScript): void{
    this.storageService.remove("download-scripts","_id",script._id).then((value:string)=>{
      script.models.forEach((id:string) => {
        this.storageService.remove("download-networks","_id",id);
      })

      if(this.status === OnlineStatusType.OFFLINE){
        return;
      }
  
      if(!this.gapi.isLoggedIn()){
        return;
      }

      this.scriptService.removeDownload(script._id).subscribe({
        next:()=>{
          this.notifications.add({type:"success",message:`Successfully removed ${script.name}`});
          this.scripts = this.scripts.filter((value:downloadScript) => value._id !== script._id);
          this.filter = this.filter.filter((value:downloadScript) => value._id !== script._id);
        },
        error:()=>{
          this.notifications.add({type:"danger",message:`Something went wrong when deleting ${script.name}`})
        }
      })
    }).catch((reason)=>{
      console.log(reason);
      this.notifications.add({type:"warning",message:"Failed to remove script. Try again later or contact the developer if the error persists"});
    })
  }

  clear(): void{
    this.scripts.forEach((value:downloadScript) => {
      this.remove(value);
    })
  }
}
