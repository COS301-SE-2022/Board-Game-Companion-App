import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { LoginComponent, PagesModule } from '@board-game-companion-app/pages';
import { SharedModule } from '@board-game-companion-app/shared';
import { HttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
    SocialLoginModule, 
    SocialAuthServiceConfig,
} from 'angularx-social-login';
import { GoogleLoginProvider } from 'angularx-social-login';
import { environment } from '../environments/environment';


@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    RouterModule.forRoot([], { initialNavigation: 'enabledBlocking' }),
    SharedModule,
    SocialLoginModule,
    PagesModule,
    HttpClientModule,
    FormsModule

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
          provider: new GoogleLoginProvider('677374700508-fqqrhga2mofdj1r9augtntsqpnn1kkkn.apps.googleusercontent.com'),
  
        },
      ],
      } as SocialAuthServiceConfig,
    },
  ],
  bootstrap: [AppComponent],
  
})
export class AppModule {}
