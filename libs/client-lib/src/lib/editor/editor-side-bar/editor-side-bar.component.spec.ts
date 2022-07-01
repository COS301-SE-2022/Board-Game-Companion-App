import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditorSideBarComponent } from './editor-side-bar.component';

describe('EditorSideBarComponent', () => {
  let component: EditorSideBarComponent;
  let fixture: ComponentFixture<EditorSideBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditorSideBarComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditorSideBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
