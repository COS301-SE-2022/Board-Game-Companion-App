import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { EditorComponent } from './editor/editor.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { EditorToolBarComponent } from './editor-tool-bar/editor-tool-bar.component';
import { EditorSideBarComponent } from './editor-side-bar/editor-side-bar.component';
import { EditorStatusBarComponent } from './editor-status-bar/editor-status-bar.component';
import { EditorConsoleComponent } from './editor-console/editor-console.component';
import { EditorBodyComponent } from './editor-body/editor-body.component';
import { SharedModule } from '../shared/shared.module';
import { EditorHelpComponent } from './editor-help/editor-help.component';
import { EditorThemeComponent } from './editor-theme/editor-theme.component';
import { EditorEditFeaturesComponent } from './editor-edit-features/editor-edit-features.component';
import { EditorEntityComponent } from './editor-entity/editor-entity.component';
import { EditorVisualsComponent } from './editor-visual-side-bar/editor-visual-side-bar.component';
import { EditorTextSideBarComponent } from './editor-text-side-bar/editor-text-side-bar.component';
import { EditorModelsComponent } from './editor-models/editor-models.component';

@NgModule({
  declarations: [
    EditorComponent,
    EditorToolBarComponent,
    EditorSideBarComponent,
    EditorStatusBarComponent,
    EditorConsoleComponent,
    EditorBodyComponent,
    EditorHelpComponent,
    EditorThemeComponent,
    EditorEditFeaturesComponent,
    EditorEntityComponent,
    EditorVisualsComponent,
    EditorTextSideBarComponent,
    EditorModelsComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule,
    RouterModule.forChild([{ path: '', component: EditorComponent }]),
  ],
})
export class ScriptEditorModule {}
