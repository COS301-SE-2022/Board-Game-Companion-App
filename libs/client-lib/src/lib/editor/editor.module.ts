import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { EditorComponent } from './editor/editor.component';
import{ EditorModule } from '@tinymce/tinymce-angular';
import { ReactiveFormsModule } from '@angular/forms'


@NgModule({
  declarations: [
    EditorComponent
  ],
  imports: [
    EditorModule,
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild([{path:'',component:EditorComponent}])
  ]
})
export class ScriptEditorModule { }
