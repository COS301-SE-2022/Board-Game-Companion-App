import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ScriptsComponent } from './scripts/scripts.component';
import { ToolBarComponent } from './tool-bar/tool-bar.component';
import { PopoverModule } from "ngx-smart-popover";
import { CreateScriptComponent } from './create-script/create-scripts.component';
import { FormsModule } from '@angular/forms';
import { UpdateScriptComponent } from './update-script/update-scripts.component';
@NgModule({
  declarations: [
    ScriptsComponent,
    ToolBarComponent,
    CreateScriptComponent,
    UpdateScriptComponent
  ],
  imports: [
    CommonModule,
    PopoverModule,
    FormsModule,
    RouterModule.forChild([{path:'',component:ScriptsComponent}])
  ]
})
export class ScriptsModule { }
