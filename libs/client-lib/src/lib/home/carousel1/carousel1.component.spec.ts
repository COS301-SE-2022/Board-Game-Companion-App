import { HttpClientTestingModule } from '@angular/common/http/testing';
import {  TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { BggSearchService } from '../../shared/services/bgg-search/bgg-search.service';
import { Carousel1Component } from './carousel1.component';

describe('Carousel1Component', () => {
  let component: Carousel1Component;
  // let fixture: ComponentFixture<Carousel1Component>;
  let service: BggSearchService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Carousel1Component],
      providers:[BggSearchService],
      imports:[HttpClientTestingModule,RouterTestingModule]
    }).compileComponents();
  });

  // beforeEach(() => {
  //   fixture = TestBed.createComponent(Carousel1Component);
  //   component = fixture.componentInstance;
  //   fixture.detectChanges();
  // });

  it('should create', () => {
    service = TestBed.inject(BggSearchService);
    router = TestBed.inject(Router);
    component = new Carousel1Component(service, router);
    expect(component).toBeTruthy();
  });
});
