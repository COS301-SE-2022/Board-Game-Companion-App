import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditorStatusBarComponent } from './editor-status-bar.component';

describe('EditorStatusBarComponent', () => {
  let component: EditorStatusBarComponent;
  let fixture: ComponentFixture<EditorStatusBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditorStatusBarComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditorStatusBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
