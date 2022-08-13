import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ModelsComponent } from './models/models.component';
import { GeneralComponent } from './general/general.component';
import { TrainComponent } from './train/train.component';
import { FormsModule } from '@angular/forms';
import { LoadDataComponent } from './load-data/load-data.component';
import { ArchitectureComponent } from './architecture/architecture.component';
import { ConfigureComponent } from './configure/configure.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    ModelsComponent,
    GeneralComponent,
    TrainComponent,
    LoadDataComponent,
    ArchitectureComponent,
    ConfigureComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    RouterModule.forChild([{ path: '', component: ModelsComponent }]),
  ],
})
export class ModelsModule {}
