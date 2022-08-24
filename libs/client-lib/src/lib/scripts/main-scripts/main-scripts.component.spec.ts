import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainScriptsComponent } from './main-scripts.component';

describe('MainScriptsComponent', () => {
  let component: MainScriptsComponent;
  let fixture: ComponentFixture<MainScriptsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MainScriptsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MainScriptsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
