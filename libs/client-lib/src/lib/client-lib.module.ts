import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientLibRoutingModule } from './client-lib-routing.module';
import { SharedModule } from './shared/shared.module';
import { UploadsModule } from '@board-game-companion-app/uploads';

@NgModule({
  imports: [CommonModule, ClientLibRoutingModule, UploadsModule],
  exports: [SharedModule],
})
export class ClientLibModule {}

export class ScriptExecutorModule {

  
}
