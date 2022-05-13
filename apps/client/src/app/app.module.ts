import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { PagesModule } from '@board-game-companion-app/pages';
import { SharedModule } from '@board-game-companion-app/shared';
import { HttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import {
    SocialLoginModule, 
    SocialAuthServiceConfig,
} from 'angularx-social-login';
import { GoogleLoginProvider } from 'angularx-social-login';


@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    RouterModule.forRoot([], { initialNavigation: 'enabledBlocking' }),
    SharedModule,
    SocialLoginModule,
    PagesModule,
    HttpClientModule

  ],
  providers: [
    SharedModule, HttpClient,
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
      autoLogin: false,
      providers: [
        {
          id: GoogleLoginProvider.PROVIDER_ID,
          provider: new GoogleLoginProvider('883101879417-06l0onmc1qnkblboa1cs4v7bhckb6kqb.apps.googleusercontent.com')
  
        },
      ],
      } as SocialAuthServiceConfig,
    },
  ],
  bootstrap: [AppComponent],
  
})
export class AppModule {}
