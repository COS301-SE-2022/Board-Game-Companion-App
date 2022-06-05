import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { BggSearchService } from './services/bgg-search/bgg-search.service';
import { ScriptService } from './services/scripts/script.service';

@NgModule({
  declarations: [
    FooterComponent,
    FooterComponent,
    HeaderComponent
  ],
  imports: [
    CommonModule
  ],
  providers: [
    BggSearchService,
    ScriptService
  ],
  exports: [
    HeaderComponent,
    FooterComponent
  ]
})
export class SharedModule { }
