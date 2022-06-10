import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScriptDetailComponent } from './script-detail.component';

describe('ScriptDetailComponent', () => {
  let component: ScriptDetailComponent;
  let fixture: ComponentFixture<ScriptDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ScriptDetailComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScriptDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
