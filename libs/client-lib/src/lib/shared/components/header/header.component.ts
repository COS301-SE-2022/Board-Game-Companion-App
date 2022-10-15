import { Component, ElementRef, Input, KeyValueDiffer, KeyValueDiffers, OnInit,OnDestroy , ViewChild, HostListener } from '@angular/core';
import { Router } from '@angular/router';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { GoogleAuthService, userDetails} from '../../../google-login/GoogleAuth/google-auth.service';
import { OnlineStatusService, OnlineStatusType } from 'ngx-online-status';
import { AlertService } from '../../services/alert/alert.service'
import { alertInfo } from '../../models/alert/alertInfo'
import { NotificationComponent } from '../notification/notification.component';
import { alert } from '../../models/alert/alert';
import { alertType } from '../../models/alert/alertType';
import { ScriptService } from '../../services/scripts/script.service';
import { BggSearchService } from '../../services/bgg-search/bgg-search.service';
import { automataScript } from '../../models/scripts/automata-script';
import { downloadScript } from '../../models/scripts/download-script';
import { oldScript } from '../../models/scripts/old-script';
import { CollectionService } from '../../services/collections/collection.service';
import { Subscription } from 'rxjs';
import { Socket } from 'ngx-socket-io';
import { AdminService } from '../../services/admin/admin.service';
import { myScript } from '../../models/scripts/my-script';

@Component({
  selector: 'board-game-companion-app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  // @ViewChild('menu', {static: false, read: ElementRef}) 
  // burgerbtn: any; //similar to getElementById
  ShowMenu = false; 
  status: OnlineStatusType = OnlineStatusType.ONLINE;
  UserDetails: any | undefined;
  log = "login";
  loggedIn = false;
  adminAccount = false;
  searchValue = "";
  showHeader = true;
  @Input()height = 0;
  focus = "";
  width = window.innerWidth;
  breakpoint = 600;
  showOptions = false;
  differ: KeyValueDiffer<string, any>;
  profile = "assets/images/no-profile.png";
  alerts:alertInfo[] = [];
  alertSubscription!:Subscription;
  @ViewChild(NotificationComponent,{static:true}) notifications: NotificationComponent = new NotificationComponent();

  constructor(private readonly router:Router,
              private readonly gapi: GoogleAuthService, 
              private differs: KeyValueDiffers,
              private networkService: OnlineStatusService,
              private readonly alertService:AlertService,
              private readonly scriptService:ScriptService,
              private readonly bggSearch:BggSearchService,
              private readonly collectionService:CollectionService,
              private readonly socket: Socket,
              private readonly adminService: AdminService) {
                this.networkService.status.subscribe((status: OnlineStatusType) =>{
                  this.status = status;
              }); 

    gapi.UserSubject.subscribe({
      next:(value)=>{
        this.UserDetails = value;
        this.profile = value.info.picture;
        sessionStorage.setItem("name",value.info.name);
        sessionStorage.setItem("email",value.info.email);
        sessionStorage.setItem("img",value.info.picture);
        this.adminService.banned().subscribe({
          next:(response:boolean) => {
            if(response){
              this.notifications.add({type:"danger",message:"Your account has been blocked."});
              this.loggedIn = false;
              this.gapi.signOut();
              sessionStorage.removeItem("name");
              sessionStorage.removeItem("email");
              sessionStorage.removeItem("image");
              this.profile = "assets/images/no-profile.png";
              return;
            }else{
              this.checkIfAdmin();
              this.getAlerts();
              this.receiveAlerts();
              this.createFavouritesCollection();
              this.socket.emit('login',value.info.email);
            }
          }
        })
      },
      error:(err)=>{     
        console.log(err);
      }      
    })
    this.differ = this.differs.find({}).create();
  }

  ngOnDestroy(): void {
    if(this.alertSubscription!==undefined){
      this.alertSubscription.unsubscribe();
    }
  }

  online(): boolean{
    return this.status === OnlineStatusType.ONLINE;
  }


  checkIfAdmin(): void{
    this.adminService.isAdmin().subscribe({
      next:(response:boolean) =>{
        this.adminAccount = response
      }
    })
  }

  getStatus(): string{
    if(this.online()){
      if(this.gapi.isLoggedIn()){
        return "online";
      }else
        return "signed out"
    }else
      return "offline";
  }

  ngOnInit(): void {
    if(this.gapi.isLoggedIn())
    {
      
      this.loggedIn = true;
      const el = document.getElementById('l');
      console.log(el!=null)
      if(el!=null)
      {
        el.innerHTML = "logout";

        this.log = "logout";
      } 
      this.getAlerts();
      this.createFavouritesCollection();
    }
    
    this.router.navigate(['/home']);
   
    document.addEventListener('editor-page',(event)=>{
      this.showHeader = false;
    })

    document.addEventListener('editor-exit',(event)=>{
      this.showHeader = true;
      this.focus = "scripts";
    })
  }

  @HostListener('window:resize', ['$event'])
  onScreenResize(): void{

    this.width = window.innerWidth;
  }


  toggleMenu():void{
    console.log('toggle function called');
    // this.burgerbtn.nativeElement.classList.toggle('translate-x-0');
    this.ShowMenu = !this.ShowMenu;
  }


  isLoggedIn():boolean{
    return this.gapi.isLoggedIn();
  }

  moveTo(path:string):void{
    this.showOptions = false;
    this.focus = path;

    if(path == "collection")
    {
      this.router.navigate(['/home']);
    }
    else if(path=="login")
    {
      if(this.log == "login")
      {
        this.router.navigate(['/' + path]);
      }
      else
      {
        this.loggedIn = false;
        this.gapi.signOut();
        this.socket.emit("logout",sessionStorage.getItem("email"))
        sessionStorage.removeItem("name");
        sessionStorage.removeItem("email");
        sessionStorage.removeItem("image");
        this.profile = "assets/images/no-profile.png";
        this.alertSubscription.unsubscribe();
        this.router.navigate(['/home']);
        this.socket.emit("logout",sessionStorage.getItem("email"))
      }
    }
    else if(path==="board-game-search")
    {
      this.router.navigate(['/board-game-search']);
    }
    else{
      this.router.navigate(['/' + path]);
    }
  }

  // eslint-disable-next-line @angular-eslint/use-lifecycle-interface
  ngDoCheck() {
    const change = this.differ.diff(this);
    if (change) {
      const el = document.getElementById('l');
      if(this.gapi.isLoggedIn())
    {
      
      this.loggedIn = true;
      
      
      if(el!=null)
      {
        el.innerHTML = "Logout";

        this.log = "logout";
      } 

    }else
    {
      this.loggedIn = false;
      if(el!=null)
      {
        el.innerHTML = "Login";

        this.log = "login";
      } 
    }
    }
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

  getTime(date:Date): string{
    let result = "";
    let temp = 0;
    const today = new Date(); 
    const current = new Date(date);

    temp = today.getFullYear() - current.getFullYear();

    if(temp !== 0){
      result = temp.toString() + " year" + (temp == 1 ? "" :"s") + " ago";
    }else{
      temp = today.getMonth() - current.getMonth();
      
      if(temp !== 0){
        result = temp.toString() + " month" + (temp == 1 ? "" :"s") + " ago";
      }else{
        temp = today.getDate() - current.getDate();

        if(temp !== 0){
          result = temp.toString() + " day" + (temp == 1 ? "" :"s") + " ago";
        }else{
          temp = today.getHours() - current.getHours();
          
          if(temp !== 0){
            result = temp.toString() + " hour" + (temp == 1 ? "" :"s") + " ago";
          }else{
            temp = today.getMinutes() - current.getMinutes();

            if(temp !== 0){
              result = temp.toString() + " minute" + (temp == 1 ? "" :"s") + " ago";
            }else{
              temp = today.getSeconds() - current.getSeconds();
              result = temp.toString() + " second" + (temp == 1 ? "" :"s") + " ago";
            }
          }
        }
      }
    }
    
    return result;
  }

  createFavouritesCollection(): void{
    this.collectionService.alreadyExists("favourites").subscribe({
      next:(value:boolean) => {
        if(!value){
          this.collectionService.createCollection("favourites").subscribe({
            error:(err) => {
              console.log(err)
            }
          })
        }
      },
      error:(err) => {
        console.log(err);
      }
    });
  }

  receiveAlerts(): void{
    this.alertSubscription = this.alertService.receiveAlerts().subscribe({
      next:(value:alert) => {
        switch(value.alertType){
          case alertType.Collection:{
            const [scriptId,boardgameId] = value.link.split("@");
            this.scriptService.getAutomataById(scriptId).subscribe({
              next:(script:automataScript | oldScript) => {
                this.bggSearch.getBoardGameById(boardgameId).subscribe({
                  next:(gameInfo:any) => {
                    const game = this.bggSearch.parseGetBoardGameById(gameInfo);
                    this.alerts.push({
                      subject: "Collection",
                      message: `${script.name} v${script.version.major}.${script.version.minor}.${script.version.patch} has been released for ${game.name}`,
                      alert: value
                    })
                  },
                  error:(err) => {
                    console.log(err)
                  }
                })
              },
              error:(err) => {
                console.log(err)
              }
            })
          }break;
          case alertType.Comment:{
            const [name,scriptId] = value.link.split("@");
            this.scriptService.getAutomataById(scriptId).subscribe({
              next:(script:automataScript | oldScript) => {

                this.alerts.push({
                  subject: "Comment",
                  message: `${name} commented on ${script.name} v${script.version.major}.${script.version.minor}.${script.version.patch}`,
                  alert: value
                })
              },
              error:(err) => {
                console.log(err)
              }
            })
          }break;
          case alertType.Update:{
            const [scriptId,downloadId] = value.link.split("@");
            this.scriptService.getAutomataById(scriptId).subscribe({
              next:(script:automataScript | oldScript) => {
                this.scriptService.getDownloadedScript(downloadId).subscribe({
                  next:(download:downloadScript) => {
                    this.alerts.push({
                      subject: "Update",
                      message: `${download.name} v${download.version.major}.${download.version.minor}.${download.version.patch} has new version v${script.version.major}.${script.version.minor}.${script.version.patch}`,
                      alert: value
                    })
                  },
                  error:(err) => {
                    console.log(err);
                  }
                });

    
              },
              error:(err) => {
                console.log(err)
              }
            })
          }break;
          case alertType.Flagged:{
            console.log("flagged")
          }break;
          case alertType.Reply:{
            const [name,scriptId] = value.link.split("@");
            this.scriptService.getAutomataById(scriptId).subscribe({
              next:(script:automataScript | oldScript) => {

                this.alerts.push({
                  subject: "Reply",
                  message: `${name} replied to your comment on ${script.name} v${script.version.major}.${script.version.minor}.${script.version.patch}`,
                  alert: value
                })
              },
              error:(err) => {
                console.log(err)
              }
            })
          }break;
          case alertType.Warning:{
            this.alerts.push({
              subject: "Warning",
              message: value.link,
              alert: value
            })
          }break;
        }
      }
    })
  }

  getAlerts(): void{
    this.alerts = [];
    this.alertService.getAllUnReadUserMessages().subscribe({
      next:(response:alert[]) => {
        response.forEach((value:alert) => {

          switch(value.alertType){
            case alertType.Collection:{
              const [scriptId,boardgameId] = value.link.split("@");
              this.scriptService.getAutomataById(scriptId).subscribe({
                next:(script:automataScript | oldScript) => {
                  this.bggSearch.getBoardGameById(boardgameId).subscribe({
                    next:(gameInfo:any) => {
                      const game = this.bggSearch.parseGetBoardGameById(gameInfo);
                      this.alerts.push({
                        subject: "Collection",
                        message: `${script.name} v${script.version.major}.${script.version.minor}.${script.version.patch} has been released for ${game.name}`,
                        alert: value
                      })
                    },
                    error:(err) => {
                      console.log(err)
                    }
                  })
                },
                error:(err) => {
                  console.log(err)
                }
              })
            }break;
            case alertType.Comment:{
              const [name,scriptId] = value.link.split("@");
              this.scriptService.getAutomataById(scriptId).subscribe({
                next:(script:automataScript | oldScript) => {

                  this.alerts.push({
                    subject: "Comment",
                    message: `${name} commented on ${script.name} v${script.version.major}.${script.version.minor}.${script.version.patch}`,
                    alert: value
                  })
                },
                error:(err) => {
                  console.log(err)
                }
              })
            }break;
            case alertType.Update:{
              const [scriptId,downloadId] = value.link.split("@");
              this.scriptService.getAutomataById(scriptId).subscribe({
                next:(script:automataScript | oldScript) => {
                  this.scriptService.getDownloadedScript(downloadId).subscribe({
                    next:(download:downloadScript) => {
                      this.alerts.push({
                        subject: "Update",
                        message: `${download.name} v${download.version.major}.${download.version.minor}.${download.version.patch} has new version v${script.version.major}.${script.version.minor}.${script.version.patch}`,
                        alert: value
                      })
                    },
                    error:(err) => {
                      console.log(err);
                    }
                  });

      
                },
                error:(err) => {
                  console.log(err)
                }
              })
            }break;
            case alertType.Flagged:{
              const [type,id] = value.link.split("@");
              
              if(type === "download-script"){
                this.scriptService.getDownloadedScript(id).subscribe({
                  next:(script: downloadScript) => {
                    this.alerts.push({
                      subject: "Flagged download",
                      message: `${script.name} v${script.version.major}.${script.version.minor}.${script.version.patch} has been flagged.`,
                      alert: value
                    })                    
                  },
                  error:(err) => {
                    console.log(err);
                  }
                })
              }else if(type === "my-script"){
                this.scriptService.getMyScriptById(id).subscribe({
                  next:(script: myScript) => {
                    this.alerts.push({
                      subject: "Flagged release",
                      message: `${script.name} v${script.version.major}.${script.version.minor}.${script.version.patch} has been flagged.`,
                      alert: value
                    })                    
                  },
                  error:(err) => {
                    console.log(err);
                  }
                })
              }else if(type === "comment"){
                this.scriptService.getAutomataById(id).subscribe({
                  next:(script: automataScript | oldScript) => {
                    this.alerts.push({
                      subject: "Flagged comment",
                      message: `Your comment on ${script.name} v${script.version.major}.${script.version.minor}.${script.version.patch} has been flagged.`,
                      alert: value
                    })                    
                  },
                  error:(err) => {
                    console.log(err);
                  }
                })
              }
            }break;
            case alertType.Reply:{
              const [name,scriptId] = value.link.split("@");
              this.scriptService.getAutomataById(scriptId).subscribe({
                next:(script:automataScript | oldScript) => {

                  this.alerts.push({
                    subject: "Reply",
                    message: `${name} replied to your comment on ${script.name} v${script.version.major}.${script.version.minor}.${script.version.patch}`,
                    alert: value
                  })
                },
                error:(err) => {
                  console.log(err)
                }
              })
            }break;            
            case alertType.Warning:{
              this.alerts.push({
                subject: "Warning",
                message: value.link,
                alert: value
              })
            }break;
          }
        });
      },
      error:() => {
        this.notifications.add({type:"warning",message:"Failed to load notifications"});
      }
    })
  }
  

  processAlert(alert:alertInfo): void{
    this.alertService.markAsRead(alert.alert._id).subscribe({
      next:() => {
        this.alerts = this.alerts.filter((val:alertInfo) => val.alert._id !== alert.alert._id);
        
        switch(alert.alert.alertType){
          case alertType.Collection:{
            const scriptId = alert.alert.link.split("@")[0];
            this.router.navigate(['collections'], { state: { value: scriptId } });
          }break;
          case alertType.Comment:{
            const scriptId = alert.alert.link.split("@")[1];
            this.scriptService.getAutomataById(scriptId).subscribe({
              next:(response:automataScript |oldScript) =>{
                this.router.navigate(['script-detail'], { state: { value: response } });
              },
              error:(err)=>{
                console.log(err);
                this.notifications.add({type:"warning",message:"Failed to the script."})
              }
            })
          }break;
          case alertType.Reply:{
            const scriptId = alert.alert.link.split("@")[1];
            this.scriptService.getAutomataById(scriptId).subscribe({
              next:(response:automataScript |oldScript) =>{
                this.router.navigate(['script-detail'], { state: { value: response } });
              },
              error:(err)=>{
                console.log(err);
                this.notifications.add({type:"warning",message:"Failed to the script."})
              }
            })
          }break;
          case alertType.Update:{
            const scriptId = alert.alert.link.split("@")[0];
            this.scriptService.getAutomataById(scriptId).subscribe({
              next:(response:automataScript |oldScript) =>{
                this.router.navigate(['script-detail'], { state: { value: response } });
              },
              error:(err)=>{
                console.log(err);
                this.notifications.add({type:"warning",message:"Failed to the script."})
              }
            })
          }break;
          case alertType.Flagged:{
            const [type,id] = alert.alert.link.split("@");
              
            if(type === "download-script"){
              this.router.navigate(['scripts']);
            }else if(type === "my-script"){
              this.router.navigate(['scripts']);
            }else if(type === "comment"){
              this.scriptService.getAutomataById(id).subscribe({
                next:(script: automataScript | oldScript) => {
                  this.router.navigate(['script-detail'], { state: { value: script } });                   
                },
                error:(err) => {
                  this.notifications.add({type:"warning",message:"Failed to the script."})
                }
              })
            }
          }break;
        }
      },
      error:(err) => {
        console.log(err);
        this.notifications.add({type:"warning",message:"Something went wrong in server when attempting to mark notifications as read.Try again later and if the error persists,you can contact the administrator."})
      }
    })
    
    
  }
}


