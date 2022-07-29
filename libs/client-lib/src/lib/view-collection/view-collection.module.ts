import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ViewCollectionComponent } from './view-collection/view-collection.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    ViewCollectionComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild([{path:'',component:ViewCollectionComponent}])
  ]
})
export class ViewCollectionModule { }
