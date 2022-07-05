import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { GoogleAuthService, userDetails} from '../../../google-login/GoogleAuth/google-auth.service';



@Component({
  selector: 'board-game-companion-app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {

  UserDetails: userDetails | undefined;
  log = "login";
  loggedIn = false;
  admin:string[] = ["u18166793@tuks.co.za","u18080368@tuks.co.za","mattrmarsden@gmail.com"];

  constructor(private readonly router:Router, private readonly gapi: GoogleAuthService) {
    

    gapi.UserSubject.subscribe(details=>{
      this.UserDetails = details;
      console.log(this.UserDetails);
    })
  }

  ngOnInit(): void {

    if(this.gapi.isLoggedIn())
    {
      this.loggedIn = true;
      const el = document.getElementById('l');
      if(el!=null)
      {
        el.innerHTML = "logout";

        this.log = "logout";
      } 

    }else
      this.router.navigate(['/script-detail']);
    
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
}
