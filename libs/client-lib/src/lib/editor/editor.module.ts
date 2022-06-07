import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { EditorComponent } from './editor/editor.component';
import{ EditorModule } from '@tinymce/tinymce-angular';

@NgModule({
  declarations: [
    EditorComponent
  ],
  imports: [
    EditorModule,
    CommonModule,
    RouterModule.forChild([{path:'',component:EditorComponent}])
  ]
})
export class ScriptEditorModule { }
