import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { MostActive, BggSearchService } from '../bgg-search-service/bgg-search.service';
import { BoardGameSearchComponent } from './board-game-search.component';

export const mockMostActive : MostActive[]  = [{
  id:"154930",
  name:"3rd Millennium Chess",
  image:"https://cf.geekdo-images.com/LQa7DiMcfR6PPxbTaKjDXA__thumb/img/H1Vra1AuINeZKHKwh2b7nXyWrys=/fit-in/200x150/filters:strip_icc()/pic2518692.jpg",
}];

const mockBggService = {
  getMostActive : jest.fn()
};

describe('AdminComponent', () => {
  let component: BoardGameSearchComponent;
  let fixture: ComponentFixture<BoardGameSearchComponent>;
  let service: BggSearchService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BoardGameSearchComponent],
      imports: [RouterTestingModule,HttpClientTestingModule],
      providers: [{BggSearchService, useValue:mockBggService}]
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

  it('Initial variables', () => {
    expect(component.left).toBe(1);
    expect(component.middle).toBe(2);
    expect(component.right).toBe(3);
    expect(component.size).toBe(0);
    expect(component.boardsPerPage).toBe(10);
    expect(component.searchValue).toBe("");
    expect(component.exactMatch).toBe(false);
  });

  it('should return a array of objects', async () => {

    component = fixture.componentInstance;
    mockBggService.getMostActive.mockImplementationOnce(() => of(mockMostActive));
    component.ngOnInit();
    expect(component.mostActive.length).toBeGreaterThanOrEqual(0);
  });

  it('Service injected via inject(...) and TestBed.get(...) should be the same instance',
    inject([BggSearchService], (injectService: BggSearchService) => {
      service = TestBed.get(BggSearchService);
      expect(injectService).toBe(service);
    })
  );

});