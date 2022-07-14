import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ClientLibRoutingModule } from '../../client-lib-routing.module';
import { HomeComponent } from './home.component';
import { BggSearchService } from '../../shared/services/bgg-search/bgg-search.service';
import { Router } from '@angular/router';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let service: BggSearchService;

  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HomeComponent],
      imports: [HttpClientTestingModule,ClientLibRoutingModule,RouterTestingModule.withRoutes([])],
      providers: [BggSearchService]
    }).compileComponents();
  });

  it('should create component', () => {
    service = TestBed.inject(BggSearchService);
    router = TestBed.inject(Router);
    component = new HomeComponent(service,router);
    expect(component).toBeTruthy();
  });
  it('should create service', ()=>{
    service = TestBed.inject(BggSearchService);
    router = TestBed.inject(Router);
    component = new HomeComponent(service,router);
    expect(service).toBeTruthy();
  });
  it('should be undefined ids!', ()=>{
    service = TestBed.inject(BggSearchService);
    router = TestBed.inject(Router);
    component = new HomeComponent(service,router);
    expect(component.ids).toStrictEqual(undefined);
  });

});