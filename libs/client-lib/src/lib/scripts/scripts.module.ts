import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ScriptsComponent } from './scripts/scripts.component';
import { ToolBarComponent } from './tool-bar/tool-bar.component';
import { PopoverModule } from "ngx-smart-popover";
import { CreateScriptComponent } from './create-script/create-scripts.component';
import { FormsModule } from '@angular/forms';
import { UpdateScriptComponent } from './update-script/update-scripts.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { NbContextMenuModule } from '@nebular/theme';
import { SharedModule } from '../shared/shared.module'

@NgModule({
  declarations: [
    ScriptsComponent,
    ToolBarComponent,
    CreateScriptComponent,
    UpdateScriptComponent
  ],
  imports: [
    NbContextMenuModule,
    CommonModule,
    PopoverModule,
    FormsModule,
    NgxPaginationModule,
    SharedModule,
    RouterModule.forChild([{path:'',component:ScriptsComponent}])
  ]
})
export class ScriptsModule { }
