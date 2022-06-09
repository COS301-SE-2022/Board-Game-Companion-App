import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { GoogleAuthService, userDetails} from 'libs/client-lib/src/lib/google-login/GoogleAuth/google-auth.service';



@Component({
  selector: 'board-game-companion-app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {

  UserDetails: userDetails | undefined;
  log = "login";

  constructor(private readonly router:Router, private readonly gapi: GoogleAuthService) {
    

    gapi.UserSubject.subscribe(details=>{
      this.UserDetails = details;
      console.log(this.UserDetails);
    })
  }

  ngOnInit(): void {

    if(this.gapi.isLoggedIn())
    {
      const el = document.getElementById('l');
      if(el!=null)
      {
        el.innerHTML = "logout";

        this.log = "logout";
      } 

    }
    
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
        this.gapi.signOut();
        this.router.navigate(['/home']);
      }
    }
    else{
      this.router.navigate(['/' + path]);
    }
  }
}
