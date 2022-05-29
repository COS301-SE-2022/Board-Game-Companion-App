import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { BoardGameDetailsComponent } from './board-game-details/board-game-details.component';
import { BrowserModule } from '@angular/platform-browser';
import { LoginComponent } from './login/login.component';
import { RichTextEditorModule, ToolbarService, ImageService, LinkService, HtmlEditorService } from '@syncfusion/ej2-angular-richtexteditor';
//import { SocialLoginModule, SocialAuthServiceConfig } from 'angularx-social-login';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
//import { BrowserModule } from '@angular/platform-browser';
import {
  SocialLoginModule,
  SocialAuthServiceConfig,
} from 'angularx-social-login';
//import{ GoogleLoginProvider} from 'angularx-social-login';
import { SharedModule } from '@board-game-companion-app/shared';
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

import { RouterModule, Routes } from '@angular/router';

import { CollectionsComponent } from './collections/collections.component';

import { AddToCollectionComponent } from './add-to-collection/add-to-collection.component';
import { EditorComponent } from './editor/editor.component';
import { GoogleLoginProvider } from 'angularx-social-login';

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
  {
    path: 'addGame',
    component: AddToCollectionComponent,
  },

  {
    path: 'editor',
    component: EditorComponent,
  }
];

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    SocialLoginModule,
    FlexLayoutModule,
    MatProgressSpinnerModule,
    MatSlideToggleModule,
    RichTextEditorModule
  ],
  declarations: [
    HomeComponent,
    BoardGameDetailsComponent,
    LoginComponent,
    BoardGameSearchComponent,
    PaginationComponent,
    CollectionsComponent,

    AddToCollectionComponent,
    EditorComponent,
  ],
  providers: [SharedModule, 
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
    ToolbarService, ImageService, LinkService, HtmlEditorService],
  exports: [
    HomeComponent,
    BoardGameDetailsComponent,
    BoardGameSearchComponent,
    LoginComponent,

    CollectionsComponent,

    AddToCollectionComponent,
    EditorComponent,
  ],
})
export class PagesModule {}
