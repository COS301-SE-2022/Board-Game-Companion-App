import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameSessionsComponent } from './game-sessions/game-sessions.component';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [GameSessionsComponent],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild([{path:'',component:GameSessionsComponent}])
  ],
})
export class GameSessionsModule {}
