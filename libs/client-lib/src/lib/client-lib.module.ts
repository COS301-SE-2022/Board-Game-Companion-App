import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientLibRoutingModule } from './client-lib-routing.module';
import { SharedModule } from './shared/shared.module';
import {AIScriptModule} from 'uploads/scripts/files/AIscripts.module'
@NgModule({
  imports: [CommonModule, ClientLibRoutingModule, AIScriptModule],
  exports: [SharedModule],
})
export class ClientLibModule {}

export class ScriptExecutorModule {

  
}
