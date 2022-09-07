import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BoardGameDetailsComponent } from './board-game-details/board-game-details.component';
import { SharedModule } from '../shared/shared.module';
import { OnlineStatusModule } from 'ngx-online-status';
import { AddToCollectionComponent } from './add-to-collection/add-to-collection.component';

@NgModule({
  declarations: [
    BoardGameDetailsComponent,
    AddToCollectionComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    OnlineStatusModule,
    RouterModule.forChild([{path:'',component:BoardGameDetailsComponent}])
  ]
})
export class BoardGameDetailsModule { }
