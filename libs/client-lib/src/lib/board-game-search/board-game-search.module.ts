import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BoardGameSearchComponent } from './board-game-search/board-game-search.component';
import { BggSearchService } from './bgg-search-service/bgg-search.service';
import { FormsModule } from '@angular/forms';
import { PaginationComponent } from './pagination/pagination.component';
import { FlexLayoutModule } from '@angular/flex-layout';

@NgModule({
  declarations: [
    BoardGameSearchComponent,
    PaginationComponent    
  ],
  imports: [
    CommonModule,
    FormsModule,
    FlexLayoutModule,
    RouterModule.forChild([{path:'',component:BoardGameSearchComponent}])
  ],
  providers: [
    BggSearchService
  ]
})
export class BoardGameSearchModule { }
