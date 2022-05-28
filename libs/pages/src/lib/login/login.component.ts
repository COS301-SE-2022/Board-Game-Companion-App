import { Component,OnInit } from '@angular/core';
import { SocialAuthService, GoogleLoginProvider, SocialUser } from 'angularx-social-login';
//import { ConnectableObservable } from 'rxjs';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'board-game-companion-app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})

export class LoginComponent implements OnInit{
  loginForm!: FormGroup;
  socialUser!: SocialUser;
  isLoggedin?: boolean;
 
  //user:any;
  constructor(
    private formBuilder: FormBuilder,
    private authService:SocialAuthService, 
    private router:Router
  ) {}

  //constructor(private router:Router){}

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      Email: ['', Validators.required],
      Password: ['', Validators.required],
    });
    this.authService.authState.subscribe((user) => {
      this.socialUser = user;
      this.isLoggedin = user != null;
      console.log(this.socialUser);
    });
  }
  //sign to sign in with google

  signUserIn():void
  {
    /*platform = GoogleLoginProvider.PROVIDER_ID;
    this._socialAuthServ.signIn(platform).then((response)=>{
      console.log(platform + "logged in user data is=" ,response);

      this.user =response;*/
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID).then(() =>
    this.router.navigate(['home']));
    /*this.router.navigate(['home']);*/
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
    /*this.router.navigate(['/home']);*/
  }

  TokenRefresher(): void {
    this.authService.refreshAuthToken(GoogleLoginProvider.PROVIDER_ID);
  }

  /*logout(): void{
    this.authService.signOut();
  }*/

}

