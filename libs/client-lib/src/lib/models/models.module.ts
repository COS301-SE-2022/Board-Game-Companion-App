import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ModelsComponent } from './models/models.component';
import { GeneralComponent } from './general/general.component';
import { TrainComponent } from './train/train.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    ModelsComponent,
    GeneralComponent,
    TrainComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild([{ path: '', component: ModelsComponent }]),
  ],
})
export class ModelsModule {}
