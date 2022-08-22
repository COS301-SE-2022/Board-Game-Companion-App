import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditorVisualsComponent } from './editor-visuals.component';

describe('EditorVisualsComponent', () => {
  let component: EditorVisualsComponent;
  let fixture: ComponentFixture<EditorVisualsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditorVisualsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EditorVisualsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
