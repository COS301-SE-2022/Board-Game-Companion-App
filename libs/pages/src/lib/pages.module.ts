import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { BoardGameDetailsComponent } from './board-game-details/board-game-details.component';
import { LoginComponent } from './login/login.component';
//import { BrowserModule } from '@angular/platform-browser';
//import { SocialLoginModule, SocialAuthServiceConfig } from 'angularx-social-login'; 
//import{ GoogleLoginProvider} from 'angularx-social-login';
import { SharedModule } from '@board-game-companion-app/shared';

//const google_oauth_client_id = "13912431210-vfi8j8pi30e1ree2j3f3vsfb4o762p3t.apps.googleusercontent.com";
//user:any;

//const configure = [
  //{
   // id: GoogleLoginProvider.PROVIDER_ID,
   // provider: new GoogleLoginProvider(google_oauth_client_id)
  //}
//];

/*export function provideConfig(){
  return configure;
}*/

import { BoardGameSearchComponent } from './board-game-search/board-game-search.component';
import { FormsModule } from '@angular/forms';

import { RouterModule , Routes} from '@angular/router';

const routes:Routes = [{
    path:'board-game-details',
    component:BoardGameDetailsComponent
  },{
    path:'board-game-search',
    component: BoardGameSearchComponent
  },{
    path:'home',
    component:HomeComponent
  }];

@NgModule({
  imports: [CommonModule,SharedModule,FormsModule,RouterModule.forChild(routes)], //BrowserModule, SocialLoginModule
  declarations: [HomeComponent, BoardGameDetailsComponent, LoginComponent, BoardGameSearchComponent],
  providers: [SharedModule],
    /*{
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
            useFactory: provideConfig
          },
         
        
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onError: (err: any) => {
          console.error(err);
        } 
      }as SocialAuthServiceConfig,*/
   // }
 // ],
  exports: [HomeComponent, BoardGameDetailsComponent, BoardGameSearchComponent, LoginComponent]
})

export class PagesModule {}

