import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameSessionsComponent } from './game-sessions.component';

describe('GameSessionsComponent', () => {
  let component: GameSessionsComponent;
  let fixture: ComponentFixture<GameSessionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GameSessionsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GameSessionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
