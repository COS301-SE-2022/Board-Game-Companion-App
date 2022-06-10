import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AddToCollectionComponent } from './add-to-collection/add-to-collection.component';

@NgModule({
  declarations: [
    AddToCollectionComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([{path:'',component:AddToCollectionComponent}])
  ]
})
export class AddToCollectionModule { }
