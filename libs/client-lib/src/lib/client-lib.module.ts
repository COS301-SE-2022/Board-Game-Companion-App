import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientLibRoutingModule } from './client-lib-routing.module';
import { SharedModule } from './shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    ClientLibRoutingModule
  ],
  exports: [
    SharedModule
  ]
})
export class ClientLibModule {}
