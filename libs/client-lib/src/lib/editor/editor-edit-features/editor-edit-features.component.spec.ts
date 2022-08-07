import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditorEditFeaturesComponent } from './editor-edit-features.component';

describe('EditorEditFeaturesComponent', () => {
  let component: EditorEditFeaturesComponent;
  let fixture: ComponentFixture<EditorEditFeaturesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditorEditFeaturesComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditorEditFeaturesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
