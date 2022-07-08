import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { HttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule} from './app-routing.module';
import { ClientLibModule } from '@board-game-companion-app/client-lib';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment.prod';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    ClientLibModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production,  registrationStrategy: 'registerWhenStable:30000',})
  ],
  providers: [ HttpClient],
  bootstrap: [AppComponent],
})
export class AppModule {}
