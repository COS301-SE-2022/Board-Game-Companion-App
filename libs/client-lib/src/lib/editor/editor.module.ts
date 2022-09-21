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
import { DragulaModule, DragulaService } from 'ng2-dragula';
import { EditorBodyVisualComponent } from './editor-body-visual/editor-body-visual.component';
import { ElementTemplateComponent } from './editor-body-visual/element-template';
import { LoopTemplateComponent } from './editor-body-visual/loop-template';
import { PlayerTemplateComponent } from './editor-body-visual/player-template';
import { CardTemplateComponent } from './editor-body-visual/card-template';
import { VisualHelpComponent } from './visual-help/visual-help.component';


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
    EditorModelsComponent,
    EditorBodyVisualComponent,
    ElementTemplateComponent,
    LoopTemplateComponent,
    PlayerTemplateComponent,
    CardTemplateComponent,
    VisualHelpComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule,
    DragulaModule,
    RouterModule.forChild([{ path: '', component: EditorComponent }]),
  ],
  providers: [DragulaService],
})
export class ScriptEditorModule {}
