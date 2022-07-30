import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { routes } from '../../client-lib-routing.module';
import { BggSearchService } from '../../shared/services/bgg-search/bgg-search.service';

import { CollectionsComponent } from './collections.component';

let mockStorage: any = {};

describe('CollectionsComponent', () => {
  let component: CollectionsComponent;
  let fixture: ComponentFixture<CollectionsComponent>;
  let router: Router;

  const original = window.location;
  
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CollectionsComponent],
      imports: [HttpClientTestingModule,RouterTestingModule.withRoutes(routes)],
      providers: [BggSearchService]
    }).compileComponents();
  });

  beforeEach(()=>{
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: {reload: jest.fn()}
    })
  });

  afterAll(() => {
    Object.defineProperty(window, 'location', { configurable: true, value: original });
  });

  beforeEach(() => {
    const mockLocalStorage = {
      getItem: (key: string): string => {
      return key in mockStorage ? mockStorage[key] : null },

      setItem: (key: string, value: string) => {
        mockStorage[key] = `${value}`;},

      removeItem: (key: string) => {
      delete mockStorage[key];},

      clear: () => {
        mockStorage = {};
      }
    };

    Object.defineProperty(window, 'localStorage', {
      value: mockLocalStorage
    })
  });

  it('should create', () => {
    fixture = TestBed.createComponent(CollectionsComponent);
    component =  fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  it('should navigate to viewCollection', ()=>{
    router = TestBed.inject(Router);
    const navigateSpy = jest.spyOn(router,'navigate');
    fixture = TestBed.createComponent(CollectionsComponent);
    component =  fixture.componentInstance;
    component.viewCollection('second best');
    expect(navigateSpy).toBeCalledWith(['viewCollection'], {queryParams: {my_object: 'second best'}});
  });

  it('should deleted a collection when passed string', ()=>{
    fixture = TestBed.createComponent(CollectionsComponent);
    component =  fixture.componentInstance;
    mockStorage = {collections:JSON.stringify(['my favs','second best','other'])};
    component.deletion('second best');
  });

  it('should ngOnInit()', ()=>{
    mockStorage = {
      collections:JSON.stringify(['my favs','second best','other']),
      'my favs': JSON.stringify(["27014","364866","25403"]),
      'second best': JSON.stringify(["301429","342942","220460"]),
      'other': JSON.stringify(["270239"])
    };
    fixture = TestBed.createComponent(CollectionsComponent);
    component =  fixture.componentInstance;
    component.searchedValue = 'my favs';
    component.ngOnInit();
    expect(component.collections.length).toBeGreaterThan(0);
    component.onSearch();
    expect(component.collections.length).toEqual(1);
    component.ngOnInit();
    expect(component.collections.length).toEqual(4)
    component.selected = 'amount';
    component.onSort();
    component.selected = 'alphabetical';
    component.onSort();
  });

});
