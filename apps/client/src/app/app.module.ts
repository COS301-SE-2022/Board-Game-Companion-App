import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { NxWelcomeComponent } from './nx-welcome.component';
import { RouterModule } from '@angular/router';
import { PagesModule } from '@board-game-companion-app/pages';
import { SharedModule } from '@board-game-companion-app/shared';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';


@NgModule({
  declarations: [AppComponent, NxWelcomeComponent],
  imports: [
    BrowserModule,
    RouterModule.forRoot([], { initialNavigation: 'enabledBlocking' }),
    SharedModule,
    PagesModule,
    HttpClientModule
  ],
  providers: [SharedModule, HttpClient],
  bootstrap: [AppComponent],
  
})
export class AppModule {}
