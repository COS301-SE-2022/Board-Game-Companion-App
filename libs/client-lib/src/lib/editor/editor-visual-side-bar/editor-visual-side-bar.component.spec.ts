import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DragulaModule, DragulaService } from 'ng2-dragula';

import { EditorVisualsComponent } from './editor-visual-side-bar.component';

describe('EditorVisualsComponent', () => {
  let component: EditorVisualsComponent;
  let fixture: ComponentFixture<EditorVisualsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditorVisualsComponent],
      imports: [DragulaModule],
      providers: [ DragulaService]
    }).compileComponents();

    fixture = TestBed.createComponent(EditorVisualsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
