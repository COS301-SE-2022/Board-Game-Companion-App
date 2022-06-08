import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { BggSearchService } from './services/bgg-search/bgg-search.service';
import { ScriptService } from './services/scripts/script.service';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { GoogleAuthService } from 'libs/client-lib/src/lib/google-login/GoogleAuth/google-auth.service';
import { OAuthModule } from 'angular-oauth2-oidc';

@NgModule({
  declarations: [
    FooterComponent,
    FooterComponent,
    HeaderComponent
  ],
  imports: [
    CommonModule,
    OAuthModule.forRoot(),
    
  ],
  providers: [
    BggSearchService,
    ScriptService,
    GoogleAuthService
  ],
  exports: [
    HeaderComponent,
    FooterComponent
  ]
})
export class SharedModule { }
