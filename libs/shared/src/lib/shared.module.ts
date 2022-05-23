import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarouselComponent } from './carousel/carousel.component';
import { BggSearchService } from './services/bgg-search.service';
import { HeaderComponent } from './header/header.component';
import { SearchResult } from './classes/search-result';
import { FooterComponent } from './footer/footer.component';
import { CollectionMangerComponent } from './collection-manger/collection-manger.component';

@NgModule({
  imports: [CommonModule],
  declarations: [
    CarouselComponent,
    HeaderComponent,
    FooterComponent,
    CollectionMangerComponent,
  ],
  exports: [
    CarouselComponent,
    HeaderComponent,
    BggSearchService,
    FooterComponent,
    CollectionMangerComponent,
  ],
  providers: [BggSearchService],
})
export class SharedModule {}
