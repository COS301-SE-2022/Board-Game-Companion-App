import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ScriptsComponent } from './scripts/scripts.component';
import { PopoverModule } from 'ngx-smart-popover';
import { CreateScriptComponent } from './create-script/create-scripts.component';
import { FormsModule } from '@angular/forms';
import { UpdateScriptComponent } from './update-script/update-scripts.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { NbContextMenuModule } from '@nebular/theme';
import { SharedModule } from '../shared/shared.module';
import { DownloadsPageComponent } from './downloads-page/downloads-page.component';
import { MyScriptsComponent } from './my-scripts/my-scripts.component'
import { MainScriptsComponent } from './main-scripts/main-scripts.component';
import { OnlineStatusModule } from 'ngx-online-status';

@NgModule({
  declarations: [
    ScriptsComponent,
    CreateScriptComponent,
    UpdateScriptComponent,
    DownloadsPageComponent,
    MyScriptsComponent,
    MainScriptsComponent,
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
