import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { BoardGameDetailsComponent } from './board-game-details/board-game-details.component';
import { BoardGameSearchComponent } from './board-game-search/board-game-search.component';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '@board-game-companion-app/shared';

@NgModule({
  imports: [CommonModule,SharedModule,FormsModule],
  declarations: [
    HomeComponent,
    BoardGameDetailsComponent,
    BoardGameSearchComponent,
  ],
  exports: [HomeComponent, BoardGameDetailsComponent, BoardGameSearchComponent],
  providers: [SharedModule]
})
export class PagesModule {}
