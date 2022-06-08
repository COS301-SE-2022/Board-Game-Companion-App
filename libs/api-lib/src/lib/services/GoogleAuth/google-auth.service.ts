import { Injectable } from '@angular/core';
import { AuthConfig, OAuthService } from 'angular-oauth2-oidc';
import { Subject } from 'rxjs';

const oAuthConfig:AuthConfig={
  issuer:'https://accounts.google.com',
  strictDiscoveryDocumentValidation: false,
  redirectUri:window.location.origin,
  clientId: '604714721717-e6t4ksto7fdoqmd26l7t2psvggd38la2.apps.googleusercontent.com',
  scope:'openid profile email'

}
export interface userDetails
{
    details:
    {
      sub:string,
      email:string,
      name:string,
      img:string
    }
}
@Injectable({
  providedIn: 'root'
})
export class GoogleAuthService {

  UserSubject = new Subject<userDetails>();
  constructor(private readonly oAuth: OAuthService) {
    oAuth.configure(oAuthConfig);
    oAuth.loadDiscoveryDocument().then(()=>{
      oAuth.tryLoginImplicitFlow().then(()=>{
        if(!oAuth.hasValidAccessToken())
        {
          //this.oAuth.initLoginFlow();
        }
        else
        {
          oAuth.loadUserProfile().then((userProfile)=>
          {
            this.UserSubject.next(userProfile as userDetails)
          })
        }
      })
    })
   }
   isLoggedIn():boolean{
     return this.oAuth.hasValidAccessToken();
   }
   signOut(){
     this.oAuth.logOut();
   }
   signIn()
   {
    this.oAuth.configure(oAuthConfig);
    this.oAuth.loadDiscoveryDocument().then(()=>{
      this.oAuth.tryLoginImplicitFlow().then(()=>{
        if(!this.oAuth.hasValidAccessToken())
        {
          this.oAuth.initLoginFlow();
        }
        else
        {
          this.oAuth.loadUserProfile().then((userProfile)=>
          {
            this.UserSubject.next(userProfile as userDetails)
          })
        }
      })
    })
   }
}
