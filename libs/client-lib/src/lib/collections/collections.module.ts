import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CollectionsComponent } from './collections/collections.component';

@NgModule({
  declarations: [
    CollectionsComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([{path:'',component:CollectionsComponent}])
  ]
})
export class CollectionsModule { }
