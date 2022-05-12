import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { BoardGameDetailsComponent } from './board-game-details/board-game-details.component';
import { LoginComponent } from './login/login.component';
import { BrowserModule } from '@angular/platform-browser';
import { SocialLoginModule, SocialAuthServiceConfig } from 'angularx-social-login'; 
import{ GoogleLoginProvider} from 'angularx-social-login';

const google_oauth_client_id = "13912431210-vfi8j8pi30e1ree2j3f3vsfb4o762p3t.apps.googleusercontent.com";
//user:any;

const configure = [
  {
    id: GoogleLoginProvider.PROVIDER_ID,
    provider: new GoogleLoginProvider(google_oauth_client_id)
  }
];

export function provideConfig(){
  return configure;
}

@NgModule({
  imports: [CommonModule, BrowserModule, SocialLoginModule],
  declarations: [HomeComponent, BoardGameDetailsComponent, LoginComponent],
  providers: [
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              'clientId'
            )
            /*provide: AuthServiceConfig,
            useFactory: provideConfig*/
          },
         
        ],
        onError: (err: any) => {
          console.error(err);
        } 
      }as SocialAuthServiceConfig,
    }
  ],
  exports: [HomeComponent, BoardGameDetailsComponent, LoginComponent]
})

export class PagesModule {}

