import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { BggSearchService } from '../../shared/services/bgg-search/bgg-search.service';
import { BoardGameDetailsComponent } from './board-game-details.component';


describe('BoardGameDetailsComponent', () => {
  let component: BoardGameDetailsComponent;
  let fixture: ComponentFixture<BoardGameDetailsComponent>;
  let service: BggSearchService;
  let router: Router;
  let route: ActivatedRoute;
  let httpTestingController: HttpTestingController;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule,HttpClientTestingModule],
      providers:[ BggSearchService,{ActivatedRoute,
        useValue: {
          params: of({my_object: 3454})
        }}],
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
  const mockData = '<items termsofuse="https://boardgamegeek.com/xmlapi/termsofuse">'+
  '<item type="boardgame" id="3454">'+
  '<thumbnail>https://cf.geekdo-images.com/jrDFwnjdU2l_pSPID8FWmQ__thumb/img/DxB3Eawo3UdtlMdIfZFTE1JfFlQ=/fit-in/200x150/filters:strip_icc()/pic16748.jpg</thumbnail>'+
  '<image>https://cf.geekdo-images.com/jrDFwnjdU2l_pSPID8FWmQ__original/img/XE43LGlDtD16CWMbYQUa_35AUbo=/0x0/filters:format(jpeg)/pic16748.jpg</image>'+
  '<name type="primary" sortindex="1" value="Ludus Romanus"/>'+
  '<description>Supposedly themed on a Roman game Ludus Latrunculorum, this is a simple abstract game of moving tiles and capture. The board is designed as a Roman mosaic. Rules in English, German, French, Italian and Japanese.&#10;&#10;From the publisher:&#10;&#10;Ludus Romanus is a challenging game of strategy for two players, the aim of which is to surround and entrap each one of your opponent&rsquo;s sixteen playing tiles whilst avoiding capture yourself.&#10;&#10;Ludus Romanus is based on what is known of the ancient Roman game of Ludus Latrunculorum (the game of brigands), mentioned by Varro, Ovid and Saleius Bassus. Judging by the number of boards and playing pieces found in Roman sites, Ludus Latrunculorum appears to have been an extremely popular game, played extensively throughout the Roman Empire.&#10;&#10;In Ludus Romanus we aim to capture the spirit of an ancient Roman pastime whilst providing a contemporary game that is challenging and fun to play.&#10;&#10;</description>';
  it('should get info on board game api',()=>{
    service = TestBed.inject(BggSearchService);
    router = TestBed.inject(Router);
    route = TestBed.inject(ActivatedRoute);
    httpTestingController = TestBed.inject(HttpTestingController);
    component = new BoardGameDetailsComponent(service, route, router);
    component.ngOnInit();
    const req = httpTestingController.expectOne('https://boardgamegeek.com/xmlapi2/thing?id=3454');
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });

});
