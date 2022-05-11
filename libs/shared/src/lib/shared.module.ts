import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarouselComponent } from './carousel/carousel.component';
import {BggSearchService} from './services/bgg-search.service'
import {SearchResult} from './classes/search-result'

@NgModule({
  imports: [CommonModule],
  declarations: [CarouselComponent],
  exports: [CarouselComponent],
  providers:[BggSearchService]
})
export class SharedModule {}
