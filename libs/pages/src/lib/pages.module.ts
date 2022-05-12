import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { BoardGameDetailsComponent } from './board-game-details/board-game-details.component';
import { LoginComponent } from './login/login.component';

@NgModule({
  imports: [CommonModule],
  declarations: [HomeComponent, BoardGameDetailsComponent, LoginComponent],
  exports: [HomeComponent, BoardGameDetailsComponent, LoginComponent],
})
export class PagesModule {}
