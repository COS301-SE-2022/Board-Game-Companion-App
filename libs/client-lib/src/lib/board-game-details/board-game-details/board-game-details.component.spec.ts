import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { BggSearchService } from '../bgg-search-service/bgg-search.service';
import { BoardGameDetailsComponent } from './board-game-details.component';


describe('BoardGameDetailsComponent', () => {
  let component: BoardGameDetailsComponent;
  let fixture: ComponentFixture<BoardGameDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule,HttpClientTestingModule],
      providers:[ BggSearchService],
      declarations: [BoardGameDetailsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BoardGameDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
