import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ScriptService } from '../../shared/services/scripts/script.service';
import { EditorBodyComponent } from './editor-body.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { EditorService } from '../../shared/services/editor/editor.service';
import { DragulaService } from 'ng2-dragula';

describe('EditorBodyComponent', () => {
  let component: EditorBodyComponent;
  let fixture: ComponentFixture<EditorBodyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditorBodyComponent],
      imports: [HttpClientTestingModule],
      providers: [ScriptService,EditorService,DragulaService]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditorBodyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Dracula should be default theme editor', ()=>{
    expect(component.themeEditor).toBe('Dracula');
  });

  it('empty file, should return empty array', ()=>{
    expect(component.getCode()).toBe("");
  });
});
