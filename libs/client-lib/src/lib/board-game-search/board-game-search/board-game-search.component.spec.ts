import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { MostActive, BggSearchService } from '../bgg-search-service/bgg-search.service';
import { BoardGameSearchComponent } from './board-game-search.component';

export const mockMostActive : MostActive[]  = [{
  id:"367498",
  name:"Horizons of Spirit Island",
  image:"https://cf.geekdo-images.com/jQ9g8pqZZuchIX_Pv3bHRQ__thumb/img/jIVtfyieZGB3j6WkwZEo8yteeok=/fit-in/200x150/filters:strip_icc()/pic6972881.jpg",
}];

// const mockBggService = {
//   getMostActive : jest.fn(),
//   getComments : jest.fn()
// };

const mockStorage: any = {recentlyVisited:JSON.stringify(['367498'])};
describe('AdminComponent', () => {
  let component: BoardGameSearchComponent;
  let fixture: ComponentFixture<BoardGameSearchComponent>;
  let service: BggSearchService;
  let router: Router;

  let getItemSpy: any;
  let setItemSpy: any;

  beforeAll(() => {

    setItemSpy = jest
      .spyOn(global.Storage.prototype, 'setItem')
      .mockImplementation((key, value) => {
        mockStorage[key] = value;
      });

    getItemSpy = jest
      .spyOn(global.Storage.prototype, 'getItem')
      .mockImplementation((key) => mockStorage[key]);
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BoardGameSearchComponent],
      imports: [RouterTestingModule,HttpClientTestingModule],
      providers: [BggSearchService/*, useValue:mockBggService}*/,{provide: ActivatedRoute, useValue:
        { snapshot: { paramMap: convertToParamMap( { 'value': 'chess' } ) } } }]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BoardGameSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterAll(() => {
    // then, detach our spies to avoid breaking other test suites
    getItemSpy.mockRestore()
    setItemSpy.mockRestore()
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Initial variables', () => {
    expect(component.left).toBe(1);
    expect(component.middle).toBe(2);
    expect(component.right).toBe(3);
    expect(component.size).toBe(1);
    expect(component.boardsPerPage).toBe(14);
    expect(component.searchValue).toBe("chess");
    expect(component.exactMatch).toBe(false);
  });
  jest.mock('../bgg-search-service/bgg-search.service');
  BggSearchService.prototype.getMostActive = function(){
    return of('<item id="367498" rank="1">'+
    '<thumbnail value="https://cf.geekdo-images.com/jQ9g8pqZZuchIX_Pv3bHRQ__thumb/img/jIVtfyieZGB3j6WkwZEo8yteeok=/fit-in/200x150/filters:strip_icc()/pic6972881.jpg"/>'
    +'<name value="Horizons of Spirit Island"/>'
    +'<yearpublished value="2022"/>'
    +'</item>');
  }

  BggSearchService.prototype.parseMostActive = function(data:string){
    return (mockMostActive);
  }

  BggSearchService.prototype.getComments = function(url:string){
    return of(
    '<items termsofuse="https://boardgamegeek.com/xmlapi/termsofuse">'+
    '<item type="boardgame" id="367498">'+
    '<thumbnail>https://cf.geekdo-images.com/jQ9g8pqZZuchIX_Pv3bHRQ__thumb/img/jIVtfyieZGB3j6WkwZEo8yteeok=/fit-in/200x150/filters:strip_icc()/pic6972881.jpg</thumbnail>'+
    '<image>https://cf.geekdo-images.com/jQ9g8pqZZuchIX_Pv3bHRQ__original/img/3bufrC3AVthPgq80bD32sLS-TDs=/0x0/filters:format(jpeg)/pic6972881.jpg</image>'+
    '<name type="primary" sortindex="1" value="Horizons of Spirit Island"/>'+
    '<description>Horizons of Spirit Island features the core mechanisms of Spirit Island, but features a new double-sided game board with a streamlined set-up, punchboard components, and five new Spirits designed to be ideal for those playing a Spirit Island game for the first time. These new Spirits are compatible with all existing Spirit Island components, but to play with expansions like Jagged Earth, you would need a copy of Spirit Island itself.&#10;&#10;</description>'+
    '<yearpublished value="2022"/>'+
    '<minplayers value="1"/>'+
    '<maxplayers value="3"/>'+
    '<poll name="suggested_numplayers" title="User Suggested Number of Players" totalvotes="4">'+
    '<results numplayers="1">'+
    '<result value="Best" numvotes="0"/>'+
    '<result value="Recommended" numvotes="0"/>'+
    '<result value="Not Recommended" numvotes="3"/>'+
    '</results>'+
    '<results numplayers="3">'+
    '<result value="Best" numvotes="2"/>'+
    '<result value="Recommended" numvotes="2"/>'+
    '<result value="Not Recommended" numvotes="0"/>'+
    '</poll>'+
    '<playingtime value="120"/>'+
    '<minplaytime value="90"/>'+
    '<maxplaytime value="120"/>'+
    '<minage value="14"/>'+
    '<poll name="suggested_playerage" title="User Suggested Player Age" totalvotes="1">'+
    '</poll>'+
    '<poll name="language_dependence" title="Language Dependence" totalvotes="0">'+
    '</poll>'+
    '<link type="boardgamecategory" id="2726" value="Age of Reason"/>');
  }

  it('should return a array of objects', async () => {

    component = fixture.componentInstance;
    // mockBggService.getMostActive.mockImplementationOnce(() => of(mockMostActive));
    // mockBggService.getComments.mockImplementationOnce(()=> of());
    component.ngOnInit();
    expect(component.mostActive.length).toBeGreaterThanOrEqual(0);
    component.changePage(1);
    expect(component.show.length).toBeGreaterThan(0);
  });

  it('Service injected via inject(...) and TestBed.get(...) should be the same instance',
    inject([BggSearchService], (injectService: BggSearchService) => {
      service = TestBed.inject(BggSearchService);
      expect(injectService).toBe(service);
    })
  );

  it('should navigate to details', ()=>{
    router = TestBed.inject(Router);
    const navigateSpy = jest.spyOn(router,'navigate');
    component.getDetails('12345');
    expect(navigateSpy).toBeCalledWith(['board-game-details', {my_object: '12345'}]); 
  });

  it('should change Search Mode', ()=>{
    component.changeSearchMode('exact');
    expect(component.searchMode).toBe('exact');
  });

  it('should sort the array', ()=>{
    component.ngOnInit();
    component.sort();
    expect(component.mostActive).toBeDefined();
  });

});