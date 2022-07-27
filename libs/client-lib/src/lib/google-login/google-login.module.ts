import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { GoogleLoginComponent } from './google-login.component';
import { HttpClientModule } from '@angular/common/http';
import { OAuthModule } from 'angular-oauth2-oidc';
import { GoogleAuthService } from './GoogleAuth/google-auth.service';

@NgModule({
  declarations: [
    GoogleLoginComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([{path:'',component:GoogleLoginComponent}]),
    HttpClientModule,
    OAuthModule.forRoot()
  ],
  providers:[
    GoogleAuthService
  ]
})
export class LoginModule { }
