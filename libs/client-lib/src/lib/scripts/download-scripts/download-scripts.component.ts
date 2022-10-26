import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
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
import { automataScript } from '../../shared/models/scripts/automata-script';

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
  width = window.innerWidth;
  @ViewChild(NotificationComponent,{static:true}) notifications: NotificationComponent = new NotificationComponent();
  loading = false;
  countLoads = 0;
  maxOfPage = 8;

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
    this.onScreenResize();
    this.changePage(1);
  }

  
  @HostListener('window:resize', ['$event'])
  onScreenResize(): void{
    this.width = window.innerWidth;
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

  done(): void{
    this.countLoads++;
    console.log("count: " + this.countLoads);

    if(this.countLoads === this.maxOfPage)
      this.loading = false;
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


  update(value:downloadScript): void{
    if(this.updating.includes(value._id))
      return;

    this.updates.forEach((val:update) => {
      if(val.oldId === value._id){
        this.updating.push(value._id);

        this.scriptService.updateDownloadedScript(val).subscribe({
          next:(response:downloadScript) => {
            if(response === null || response === undefined){
              this.updating = this.updating.filter((id:string) => id != value._id);
              this.notifications.add({type:"warning",message:"Could not find new version on the server."});
              return;
            }

            this.storageService.getAll("download-scripts").then((values:downloadScript[])=>{
              this.storageService.clear("download-scripts").then(()=>{
                this.storageService.getAll("download-networks").then((models:any)=>{
                  this.storageService.clear("download-networks").then(()=>{
                    values = values.filter((download:downloadScript) => download._id !== value._id);
                    models = models.filter((model:any) => !value.models.includes(model._id));
                    values.push(response);

                    this.modelsService.getModelsByIdOnly(response.models).subscribe({
                      next:(networks:any)=>{  
                        networks.forEach((network:any) => {
                          this.storageService.insert("download-networks",network).then(async(res:string) => {
                            const imodel = await tf.loadLayersModel(network.model.location);
                            await imodel.save(`indexeddb://${network.name}`);
                          }).catch(()=> this.notifications.add({type:"warning",message:"something went wrong when loading model"}))
                        })
                      },
                      error:()=>{
                        this.updating = this.updating.filter((id:string) => id != value._id);
                        this.notifications.add({type:"warning",message:`Failed to update ${value.name} locally due to models`});
                      }
                    })

                    values.forEach((script:downloadScript) => {
                      this.storageService.insert("download-scripts",script);
                    })

                    models.forEach((model:any) => {
                      this.storageService.insert("download-scripts",model);
                    })
                    
                    this.updating = this.updating.filter((id:string) => id != value._id);
                    this.scripts = this.scripts.filter((script:downloadScript) => script._id !== value._id);
                    const temp = this.filter;
                    this.filter = [];
                    temp.forEach((script:downloadScript) => {
                      if(script._id === value._id)
                        this.filter.push(response);
                      else
                        this.filter.push(script);
                    })

                    this.scripts.push(response)
                    this.updatesRequired = this.updatesRequired.filter((id:string) => id != value._id);

                    this.removeUpdate(value._id);
                    this.notifications.add({type:'success',message:`Successfully updated ${response.name}`});
                    
                  }).catch(()=>{
                    this.notifications.add({type:"warning",message:`Failed to update ${value.name} locally.`});
                    this.updating = this.updating.filter((id:string) => id != value._id);                      
                  })
                }).catch(()=>{
                  this.notifications.add({type:"warning",message:`Failed to update ${value.name} locally.`});
                  this.updating = this.updating.filter((id:string) => id != value._id);                
                })
              }).catch(() => {
                this.notifications.add({type:"warning",message:`Failed to update ${value.name} locally.`});
                this.updating = this.updating.filter((id:string) => id != value._id);                
              })
            }).catch(()=>{
              this.notifications.add({type:"warning",message:`Failed to update ${value.name} locally.`});
              this.updating = this.updating.filter((id:string) => id != value._id);
            })
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
      this.loading = true;
      this.countLoads = 0;
      this.storageService.getAll("download-scripts").then((value:any) => {
        this.filter = this.scripts = value;
      }).catch(()=>{
        this.loading = false;
        this.notifications.add({type:"danger",message:"Failed to downloaded scripts from local storage."});
      });
      
      return;
    }else if(this.status === OnlineStatusType.ONLINE){
      if(!this.gapi.isLoggedIn()){
        this.loading = true;
        this.countLoads = 0;

        this.storageService.getAll("download-scripts").then((value:any) => {
          this.filter = this.scripts = value;
        }).catch(()=>{
          this.loading = false;
          this.notifications.add({type:"danger",message:"Failed to downloaded scripts from local storage."});
        });
        
        return;        
      }else{
        this.loading = true;
        this.countLoads = 0;

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
            this.loading = false;
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
      next:(value:automataScript | oldScript) =>{
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
