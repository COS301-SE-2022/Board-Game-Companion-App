import { ScriptExecutorModule } from './scripts/files/250be175-7f5b-476b-8a32-789380ca1cd8/main.module';import { DefaultModule } from './scripts/files/6a93bfab-db39-44d2-bcdb-008b0e01be96/main.module';import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
@NgModule({
  imports: [CommonModule ,DefaultModule ,DefaultModule],
})
export class UploadsModule {}