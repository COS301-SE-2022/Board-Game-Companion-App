import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ViewCollectionComponent } from './view-collection/view-collection.component';

@NgModule({
  declarations: [
    ViewCollectionComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([{path:'',component:ViewCollectionComponent}])
  ]
})
export class ViewCollectionModule { }
