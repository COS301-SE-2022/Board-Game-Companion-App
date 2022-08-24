import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OwnScriptsPageComponent } from './own-scripts-page.component';

describe('OwnScriptsPageComponent', () => {
  let component: OwnScriptsPageComponent;
  let fixture: ComponentFixture<OwnScriptsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OwnScriptsPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(OwnScriptsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
