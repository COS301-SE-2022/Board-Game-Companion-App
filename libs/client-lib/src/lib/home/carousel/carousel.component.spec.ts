import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ClientLibRoutingModule } from '../../client-lib-routing.module';
import { CarouselComponent } from './carousel.component';
import { BggSearchService } from '../../shared/services/bgg-search/bgg-search.service';
import { Router } from '@angular/router';

describe('CarouselComponent', () => {
  let component: CarouselComponent;
  let service: BggSearchService;

  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CarouselComponent],
      imports: [HttpClientTestingModule,ClientLibRoutingModule,RouterTestingModule.withRoutes([])],
      providers: [BggSearchService]
    }).compileComponents();
  });

  it('should create component', () => {
    service = TestBed.inject(BggSearchService);
    router = TestBed.inject(Router);
    component = new CarouselComponent(service,router);
    expect(component).toBeTruthy();
  });
  it('should create service', ()=>{
    service = TestBed.inject(BggSearchService);
    router = TestBed.inject(Router);
    component = new CarouselComponent(service,router);
    expect(service).toBeTruthy();
  });
  it('should be [] listResults!', ()=>{
    service = TestBed.inject(BggSearchService);
    router = TestBed.inject(Router);
    component = new CarouselComponent(service,router);
    expect(component.listResults).toStrictEqual([]);
  });
  it('test the navigation', ()=>{
    service = TestBed.inject(BggSearchService);
    router = TestBed.inject(Router);
    component = new CarouselComponent(service,router);
    const navigateSpy = jest.spyOn(router, 'navigate');
    component.getDetails('adss142dase32132dfkkoj');
    expect(navigateSpy).toHaveBeenCalledWith(['board-game-details',{my_object: 'adss142dase32132dfkkoj'}]);
  });

});