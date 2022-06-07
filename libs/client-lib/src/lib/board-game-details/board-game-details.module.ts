import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BoardGameDetailsComponent } from './board-game-details/board-game-details.component';

@NgModule({
  declarations: [
    BoardGameDetailsComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([{path:'',component:BoardGameDetailsComponent}])
  ]
})
export class BoardGameDetailsModule { }
