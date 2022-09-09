import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisualHelpComponent } from './visual-help.component';

describe('VisualHelpComponent', () => {
  let component: VisualHelpComponent;
  let fixture: ComponentFixture<VisualHelpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VisualHelpComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(VisualHelpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
