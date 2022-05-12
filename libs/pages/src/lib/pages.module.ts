import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { BoardGameDetailsComponent } from './board-game-details/board-game-details.component';
import { SharedModule } from '@board-game-companion-app/shared';

@NgModule({
  imports: [CommonModule, SharedModule],
  declarations: [HomeComponent, BoardGameDetailsComponent],
  exports: [HomeComponent, BoardGameDetailsComponent],
  providers: [SharedModule]
})
export class PagesModule {}
