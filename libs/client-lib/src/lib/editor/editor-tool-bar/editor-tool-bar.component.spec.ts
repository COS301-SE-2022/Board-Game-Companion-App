import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { EditorToolBarComponent } from './editor-tool-bar.component';

describe('EditorToolBarComponent', () => {
  let component: EditorToolBarComponent;
  let fixture: ComponentFixture<EditorToolBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditorToolBarComponent],
      imports: [RouterTestingModule]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditorToolBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
