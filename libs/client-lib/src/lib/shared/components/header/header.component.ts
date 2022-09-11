import { Component, ElementRef, Input, KeyValueDiffer, KeyValueDiffers, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { GoogleAuthService, userDetails} from '../../../google-login/GoogleAuth/google-auth.service';



@Component({
  selector: 'board-game-companion-app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  // @ViewChild('menu', {static: false, read: ElementRef}) 
  // burgerbtn: any; //similar to getElementById
  ShowMenu = false; 
  UserDetails: any | undefined;
  log = "login";
  loggedIn = false;
  admin:string[] = ["u18166793@tuks.co.za","u18080368@tuks.co.za","mattrmarsden@gmail.com","u19062665@tuks.co.za"];
  searchValue = "";
  showHeader = true;
  @Input()height = 0;
  
  differ: KeyValueDiffer<string, any>;
  constructor(private readonly router:Router, private readonly gapi: GoogleAuthService, private differs: KeyValueDiffers) {
           
    gapi.UserSubject.subscribe({
      next:(value)=>{
        this.UserDetails = value;
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


