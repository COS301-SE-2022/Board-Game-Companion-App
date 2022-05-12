import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { BoardGameDetailsComponent } from './board-game-details/board-game-details.component';
import { BoardGameSearchComponent } from './board-game-search/board-game-search.component';
import { FormsModule } from '@angular/forms';
@NgModule({
  imports: [CommonModule,FormsModule],
  declarations: [
    HomeComponent,
    BoardGameDetailsComponent,
    BoardGameSearchComponent,
  ],
  exports: [HomeComponent, BoardGameDetailsComponent, BoardGameSearchComponent],
})
export class PagesModule {}
