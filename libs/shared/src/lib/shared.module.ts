import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarouselComponent } from './carousel/carousel.component';
import { BggSearchService } from './services/bgg-search.service';
import { HeaderComponent } from './header/header.component';
import { SearchResult } from './classes/search-result';


@NgModule({
  imports: [CommonModule],
  declarations: [CarouselComponent, HeaderComponent],
  exports: [CarouselComponent, HeaderComponent, BggSearchService],
  providers: [BggSearchService],
})
export class SharedModule {}
