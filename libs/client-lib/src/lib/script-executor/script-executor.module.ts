import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ScriptExecutorComponent } from './script-executor/script-executor.component';

@NgModule({
  declarations: [
    ScriptExecutorComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([{path:'',component:ScriptExecutorComponent}])
  ]
})
export class ScriptExecutorModule { }