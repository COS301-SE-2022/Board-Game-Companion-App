import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CollectionsComponent } from './collections/collections.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    CollectionsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild([{path:'',component:CollectionsComponent}])
  ]
})
export class CollectionsModule { }
