import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BggSearchService } from '../../shared/services/bgg-search/bgg-search.service';
import { Carousel2Component } from './carousel2.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
describe('Carousel2Component', () => {
  let component: Carousel2Component;
  let fixture: ComponentFixture<Carousel2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Carousel2Component],
      providers: [BggSearchService],
      imports:[HttpClientTestingModule,RouterTestingModule]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Carousel2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
