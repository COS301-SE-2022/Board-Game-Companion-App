import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditorModelsComponent } from './editor-models.component';

describe('EditorModelsComponent', () => {
  let component: EditorModelsComponent;
  let fixture: ComponentFixture<EditorModelsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditorModelsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditorModelsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
