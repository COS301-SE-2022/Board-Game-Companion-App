import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ScriptExecutorComponent } from './script-executor/script-executor.component';
import {SharedModule} from '../shared/shared.module';

@NgModule({
  declarations: [
    ScriptExecutorComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([{path:'',component:ScriptExecutorComponent}]),
    SharedModule,
  ]
})
export class ScriptExecutorModule { }