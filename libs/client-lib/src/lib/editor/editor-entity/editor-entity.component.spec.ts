import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditorEntityComponent } from './editor-entity.component';

describe('EditorEntityComponent', () => {
  let component: EditorEntityComponent;
  let fixture: ComponentFixture<EditorEntityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditorEntityComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditorEntityComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
