import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PopoverModule } from 'ngx-smart-popover';
import { CreateScriptComponent } from './create-script/create-scripts.component';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { NbContextMenuModule } from '@nebular/theme';
import { SharedModule } from '../shared/shared.module';
import { DownloadScriptsComponent } from './download-scripts/download-scripts.component';
import { MyScriptsComponent } from './my-scripts/my-scripts.component'
import { MainScriptsComponent } from './main-scripts/main-scripts.component';
import { OnlineStatusModule } from 'ngx-online-status';
import { AutomataScriptComponent } from './automata-scripts/automata-scripts.component';

@NgModule({
  declarations: [
    CreateScriptComponent,
    DownloadScriptsComponent,
    MyScriptsComponent,
    MainScriptsComponent,
    AutomataScriptComponent
  ],
  imports: [
    NbContextMenuModule,
    CommonModule,
    PopoverModule,
    FormsModule,
    NgxPaginationModule,
    SharedModule,
    OnlineStatusModule,
    RouterModule.forChild([{ path: '', component: MainScriptsComponent }]),
  ],
})
export class ScriptsModule {}
