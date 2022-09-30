import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientLibRoutingModule } from './client-lib-routing.module';
import { SharedModule } from './shared/shared.module';
import { NbThemeModule, NbMenuModule } from '@nebular/theme';


@NgModule({
  imports: [
    CommonModule,
    ClientLibRoutingModule,
    NbThemeModule.forRoot(),
    NbMenuModule.forRoot(),
  ],
  exports: [SharedModule],
  
})
export class ClientLibModule {}
