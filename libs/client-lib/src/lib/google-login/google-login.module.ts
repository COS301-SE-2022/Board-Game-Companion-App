import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { GoogleLoginComponent } from './google-login.component';
import { HttpClientModule } from '@angular/common/http';
import { OAuthModule } from 'angular-oauth2-oidc';

// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { GoogleAuthService } from 'libs/client-lib/src/lib/google-login/GoogleAuth/google-auth.service';

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
