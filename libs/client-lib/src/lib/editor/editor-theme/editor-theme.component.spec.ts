import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditorThemeComponent } from './editor-theme.component';

describe('EditorThemeComponent', () => {
  let component: EditorThemeComponent;
  let fixture: ComponentFixture<EditorThemeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditorThemeComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditorThemeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
