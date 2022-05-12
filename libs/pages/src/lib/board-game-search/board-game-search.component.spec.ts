import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoardGameSearchComponent } from './board-game-search.component';

describe('BoardGameSearchComponent', () => {
  let component: BoardGameSearchComponent;
  let fixture: ComponentFixture<BoardGameSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BoardGameSearchComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BoardGameSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
