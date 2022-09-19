import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ScriptService } from '../../shared/services/scripts/script.service';
import { EditorBodyComponent } from './editor-body.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { EditorService } from '../../shared/services/editor/editor.service';
import { DragulaModule, DragulaService } from 'ng2-dragula';
import { EditorBodyVisualComponent } from '../editor-body-visual/editor-body-visual.component';

import * as ace from 'ace-builds/src-noconflict/ace';
import { ElementTemplateComponent } from '../editor-body-visual/element-template';
import { PlayerTemplateComponent } from '../editor-body-visual/player-template';
ace.config.set('basePath', '/assets/ui/');
ace.config.set('modePath', '');
ace.config.set('themePath', '');

describe('EditorBodyComponent', () => {
  let component: EditorBodyComponent;
  let fixture: ComponentFixture<EditorBodyComponent>;
  let editorService:  EditorService;
  let dragulaService: DragulaService;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditorBodyComponent,EditorBodyVisualComponent,ElementTemplateComponent,PlayerTemplateComponent],
      imports: [HttpClientTestingModule,DragulaModule],
      providers: [ScriptService,EditorService,DragulaService]
    }).compileComponents();
    editorService =  TestBed.inject(EditorService);
    dragulaService = TestBed.inject(DragulaService);
  });

  it('should create', () => {
    component = new EditorBodyComponent(editorService,dragulaService)
    expect(component).toBeTruthy();
  });

  it('Dracula should be default theme editor', ()=>{
    component = new EditorBodyComponent(editorService,dragulaService)
    expect(component.themeEditor).toBe('Dracula');
  });
});
