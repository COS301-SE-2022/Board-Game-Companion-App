import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditorBodyVisualComponent } from './editor-body-visual.component';

describe('EditorBodyVisualComponent', () => {
  let component: EditorBodyVisualComponent;
  let fixture: ComponentFixture<EditorBodyVisualComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditorBodyVisualComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EditorBodyVisualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
