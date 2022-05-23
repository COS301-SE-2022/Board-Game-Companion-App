import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectionMangerComponent } from './collection-manger.component';

describe('CollectionMangerComponent', () => {
  let component: CollectionMangerComponent;
  let fixture: ComponentFixture<CollectionMangerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CollectionMangerComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CollectionMangerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
