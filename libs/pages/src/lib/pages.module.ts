import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { BoardGameDetailsComponent } from './board-game-details/board-game-details.component';
import { LoginComponent } from './login/login.component';
//import { BrowserModule } from '@angular/platform-browser';
import {
  SocialLoginModule,
  SocialAuthServiceConfig,
} from 'angularx-social-login';
//import{ GoogleLoginProvider} from 'angularx-social-login';
import { SharedModule } from '@board-game-companion-app/shared';
//const google_oauth_client_id = "13912431210-vfi8j8pi30e1ree2j3f3vsfb4o762p3t.apps.googleusercontent.com";
//user:any;
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { PaginationComponent } from './board-game-search/pagination/pagination.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

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

import { RouterModule, Routes } from '@angular/router';
import { CollectionsComponent } from './collections/collections.component';

const routes: Routes = [
  {
    path: 'board-game-details',
    component: BoardGameDetailsComponent,
  },
  {
    path: 'board-game-search',
    component: BoardGameSearchComponent,
  },
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'collections',
    component: CollectionsComponent,
  },
];

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    RouterModule.forChild(routes),
    SocialLoginModule,
    FlexLayoutModule,
    MatProgressSpinnerModule,
    MatSlideToggleModule,
  ],
  declarations: [
    HomeComponent,
    BoardGameDetailsComponent,
    LoginComponent,
    BoardGameSearchComponent,
    PaginationComponent,
    CollectionsComponent,
  ],
  providers: [SharedModule],
  exports: [
    HomeComponent,
    BoardGameDetailsComponent,
    BoardGameSearchComponent,
    LoginComponent,
    CollectionsComponent,
  ],
})
export class PagesModule {}
