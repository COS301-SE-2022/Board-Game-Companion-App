import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameSessionsComponent } from './game-sessions/game-sessions.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [GameSessionsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([{path:'',component:GameSessionsComponent}])
  ],
})
export class GameSessionsModule {}
