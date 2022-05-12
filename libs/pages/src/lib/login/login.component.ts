import { Component } from '@angular/core';
import { SocialAuthService } from 'angularx-social-login';
//import { ConnectableObservable } from 'rxjs';
import { GoogleLoginProvider } from "angularx-social-login";

@Component({
  selector: 'board-game-companion-app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  //user:any;
  constructor(private authService:SocialAuthService) {}
  

  //ngOnInit(): void {}
  //sign to sign in with google

  signUserIn():void
  {
    /*platform = GoogleLoginProvider.PROVIDER_ID;
    this._socialAuthServ.signIn(platform).then((response)=>{
      console.log(platform + "logged in user data is=" ,response);

      this.user =response;*/
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID);
  }
    

  signAdminIn():void
  {
    /*platform = GoogleLoginProvider.PROVIDER_ID;
    this._socialAuthServ.signIn(platform).then((response)=>{
      console.log(platform + "logged in user data is=" ,response);

      this.user =response;
    }
    );*/
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID);
  }


}

