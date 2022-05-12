import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { BoardGameDetailsComponent } from './board-game-details/board-game-details.component';
import { BoardGameSearchComponent } from './board-game-search/board-game-search.component';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '@board-game-companion-app/shared';
import { RouterModule , Routes} from '@angular/router';

const routes:Routes = [{
    path:'board-game-details',
    component:BoardGameDetailsComponent
  },{
    path:'board-game-search',
    component: BoardGameSearchComponent
  },{
    path:'home',
    component:HomeComponent
  }];


@NgModule({
  imports: [CommonModule,SharedModule,FormsModule,RouterModule.forChild(routes)],
  declarations: [
    HomeComponent,
    BoardGameDetailsComponent,
    BoardGameSearchComponent,
  ],
  exports: [HomeComponent, BoardGameDetailsComponent, BoardGameSearchComponent],
  providers: [SharedModule]
})
export class PagesModule {}
