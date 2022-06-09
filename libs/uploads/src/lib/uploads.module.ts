import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AIScriptModule } from './scripts/files/AIscripts.module';
@NgModule({
  imports: [CommonModule,
    AIScriptModule
  
  ],
})
export class UploadsModule {}
