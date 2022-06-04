import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ScriptComponent } from './scripts/scripts.component';
import { ToolBarComponent } from './tool-bar/tool-bar.component';
import { PopoverModule } from "ngx-smart-popover";
import { CreateScriptComponent } from './create-script/create-scripts.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    ScriptComponent,
    ToolBarComponent,
    CreateScriptComponent
  ],
  imports: [
    CommonModule,
    PopoverModule,
    FormsModule,
    RouterModule.forChild([{path:'',component:ScriptComponent}])
  ]
})
export class ScriptsModule { }
