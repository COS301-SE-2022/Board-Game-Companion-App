import { Component, ElementRef, Input, KeyValueDiffer, KeyValueDiffers, OnInit, ViewChild, HostListener } from '@angular/core';
import { Router } from '@angular/router';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { GoogleAuthService, userDetails} from '../../../google-login/GoogleAuth/google-auth.service';
import { OnlineStatusService, OnlineStatusType } from 'ngx-online-status';


@Component({
  selector: 'board-game-companion-app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  // @ViewChild('menu', {static: false, read: ElementRef}) 
  // burgerbtn: any; //similar to getElementById
  ShowMenu = false; 
  status: OnlineStatusType = OnlineStatusType.ONLINE;
  UserDetails: any | undefined;
  log = "login";
  loggedIn = false;
  admin:string[] = ["u18166793@tuks.co.za","u18080368@tuks.co.za","mattrmarsden@gmail.com","u19062665@tuks.co.za"];
  searchValue = "";
  showHeader = true;
  @Input()height = 0;
  focus = "";
  width = window.innerWidth;
  breakpoint = 600;
  showOptions = false;
  differ: KeyValueDiffer<string, any>;
  profile = "assets/images/no-profile.png"

  constructor(private readonly router:Router,
              private readonly gapi: GoogleAuthService, 
              private differs: KeyValueDiffers,
              private networkService: OnlineStatusService,) {
           
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
        
      },
      error:(err)=>{     
        console.log(err);
      }      
    })
    this.differ = this.differs.find({}).create();
  }

  online(): boolean{
    return this.status === OnlineStatusType.ONLINE;
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

    }
    
    this.router.navigate(['/board-game-search']);
   
    document.addEventListener('editor-page',(event)=>{
      this.showHeader = false;
    })

    document.addEventListener('editor-exit',(event)=>{
      this.showHeader = true;
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

  isAdmin():boolean{
    let result = false;
    
    for(let count = 0; count < this.admin.length && !result; count++){
     if(this.admin[count] === this.UserDetails?.info.email)
        result = true;
    }

    return result;
  }

  isLoggedIn():boolean{
    return this.gapi.isLoggedIn();
  }

  moveTo(path:string):void{
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
        sessionStorage.removeItem("name");
        sessionStorage.removeItem("email");
        sessionStorage.removeItem("image");
        this.profile = "assets/images/no-profile.png";
        this.router.navigate(['/home']);
      }
    }
    else if(path==="board-game-search")
    {
      this.router.navigate(['/board-game-search',{value:this.searchValue}]);
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
}


