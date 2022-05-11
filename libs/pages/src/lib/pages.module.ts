import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { BoardGameDetailsComponent } from './board-game-details/board-game-details.component';

@NgModule({
  imports: [CommonModule],
  declarations: [HomeComponent, BoardGameDetailsComponent],
  exports: [HomeComponent, BoardGameDetailsComponent],
})
export class PagesModule {}
