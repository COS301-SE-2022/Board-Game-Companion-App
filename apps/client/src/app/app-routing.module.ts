import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BoardGameDetailsComponent } from '@board-game-companion-app/pages';

const routes: Routes = [
  { path: 'BoardGameDetails', component: BoardGameDetailsComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }