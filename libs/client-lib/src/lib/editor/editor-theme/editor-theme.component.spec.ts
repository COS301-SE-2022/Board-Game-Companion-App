import { ComponentFixture, TestBed } from '@angular/core/testing';
import * as ace from 'ace-builds/src-noconflict/ace';
ace.config.set('basePath', '/assets/ui/');
ace.config.set('modePath', '');
ace.config.set('themePath', '');
import('ace-builds/src-noconflict/mode-json');
import('ace-builds/src-noconflict/theme-github');
import { EditorThemeComponent } from './editor-theme.component';

describe('EditorThemeComponent', () => {
  let component: EditorThemeComponent;
  let fixture: ComponentFixture<EditorThemeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditorThemeComponent],
    }).compileComponents();
    component = new EditorThemeComponent();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
