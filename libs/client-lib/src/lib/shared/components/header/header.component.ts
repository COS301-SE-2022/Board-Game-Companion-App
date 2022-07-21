import { Component, ElementRef, KeyValueDiffer, KeyValueDiffers, OnInit, ViewChild } from '@angular/core';
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
  UserDetails: userDetails | undefined;
  log = "login";
  loggedIn = false;
  admin:string[] = ["u18166793@tuks.co.za","u18080368@tuks.co.za","mattrmarsden@gmail.com"];
  searchValue = "";
  
  differ: KeyValueDiffer<string, any>;
  constructor(private readonly router:Router, private readonly gapi: GoogleAuthService, private differs: KeyValueDiffers) {
    

    gapi.UserSubject.subscribe(details=>{
      this.UserDetails = details;
      
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

    }else
      this.router.navigate(['/editor']);
    
  }

  toggleMenu():void{
    console.log('toggle function called');
    // this.burgerbtn.nativeElement.classList.toggle('translate-x-0');
    this.ShowMenu = !this.ShowMenu;
  }

  isAdmin():boolean{
    let result = false;

    for(let count = 0; count < this.admin.length && !result; count++){
     if(this.admin[count] === this.UserDetails?.details.email)
        result = true;
    }

    return result;
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


