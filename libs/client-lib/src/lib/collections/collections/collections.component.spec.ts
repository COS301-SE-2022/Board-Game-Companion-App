import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { DateTimeProvider, OAuthLogger, OAuthService, UrlHelperService } from 'angular-oauth2-oidc';
import { OnlineStatusService } from 'ngx-online-status';
import { routes } from '../../client-lib-routing.module';
import { BggSearchService } from '../../shared/services/bgg-search/bgg-search.service';
import { CollectionService } from '../../shared/services/collections/collection.service';
import { ModelsService } from '../../shared/services/models/models.service';
import { ScriptService } from '../../shared/services/scripts/script.service';
import { StorageService } from '../../shared/services/storage/storage.service';
import 'fake-indexeddb/auto';
import { CollectionsComponent } from './collections.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { CreateCollectionComponent } from '../create-collection/create-collection.component';
import { NotificationComponent } from '../../shared/components/notification/notification.component';

let mockStorage: any = {};

describe('CollectionsComponent', () => {
  let component: CollectionsComponent;
  let fixture: ComponentFixture<CollectionsComponent>;
  let router: Router;

  const original = window.location;
  
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CollectionsComponent,CreateCollectionComponent,NotificationComponent],
      imports: [HttpClientTestingModule,RouterTestingModule.withRoutes(routes),NgxPaginationModule],
      providers: [BggSearchService,CollectionService,OnlineStatusService,ScriptService
        ,OAuthService,UrlHelperService,OAuthLogger,DateTimeProvider,ModelsService,StorageService]
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

  it('should select', ()=>{
    // router = TestBed.inject(Router);
    fixture = TestBed.createComponent(CollectionsComponent);
    component =  fixture.componentInstance;
    jest.spyOn(component,'filterScripts');
    component.selectCollection(  {
      _id : "1",
      boardgames : ["2345","6789"],
      name: "theme-based",
      owner: {name:"Joseph",email:"u18166793@tuks.co.za"}  
    });
    expect(component.filterScripts).toBeCalledTimes(1);
    expect(component.selectedCollection.length).toBe(1);

  });

  it('should deleted a collection when passed string', ()=>{
    fixture = TestBed.createComponent(CollectionsComponent);
    component =  fixture.componentInstance;
    mockStorage = {collections:JSON.stringify(['my favs','second best','other'])};
    jest.spyOn(component,'back');
    component.back();
    expect(component.back).toBeCalledTimes(1);
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
    jest.spyOn(component,'ngOnInit');
    component.ngOnInit();
    expect(component.ngOnInit).toBeCalledTimes(1);
  });

});
