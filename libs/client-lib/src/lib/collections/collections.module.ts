import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CollectionsComponent } from './collections/collections.component';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { OnlineStatusModule } from 'ngx-online-status';
import { NgxPaginationModule } from 'ngx-pagination';
import { CreateCollectionComponent } from './create-collection/create-collection.component';

@NgModule({
  declarations: [
    CollectionsComponent,
    CreateCollectionComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    OnlineStatusModule,
    NgxPaginationModule,
    RouterModule.forChild([{path:'',component:CollectionsComponent}])
  ]
})
export class CollectionsModule { }
