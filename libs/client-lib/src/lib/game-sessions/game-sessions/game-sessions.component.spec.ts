import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { GameSessionsComponent } from './game-sessions.component';

describe('GameSessionComponent', () => {
  let component: GameSessionsComponent;
  let fixture: ComponentFixture<GameSessionsComponent>;

  
  beforeAll(() => {
    let store: any = {};

    const mockLocalStorage = {
      getItem: (key: string): string => {
      return key in store ? store[key] : null },

      setItem: (key: string, value: string) => {
      store[key] = `${value}`;},

      removeItem: (key: string) => {
      delete store[key];},

      clear: () => {
        store = {};
      }
    };

    Object.defineProperty(window, 'localStorage', {
      value: mockLocalStorage
    })
  })

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GameSessionsComponent],
      imports: [RouterTestingModule]
    }).compileComponents();
  });

  it('should create', () => {
    fixture = TestBed.createComponent(GameSessionsComponent);
    component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

});
