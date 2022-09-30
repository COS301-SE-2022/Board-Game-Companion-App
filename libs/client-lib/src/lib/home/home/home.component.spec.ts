import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ClientLibRoutingModule } from '../../client-lib-routing.module';
import { HomeComponent } from './home.component';
import { BggSearchService } from '../../shared/services/bgg-search/bgg-search.service';
import { Router } from '@angular/router';
import { CollectionService } from '../../shared/services/collections/collection.service';
import { GoogleAuthService } from '../../google-login/GoogleAuth/google-auth.service';
import { OnlineStatusService } from 'ngx-online-status';
import { StorageService } from '../../shared/services/storage/storage.service';
import { OAuthService, UrlHelperService, OAuthLogger, DateTimeProvider } from 'angular-oauth2-oidc';
import 'fake-indexeddb/auto';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let service: BggSearchService;
  let collectionService:CollectionService;
  let gapi:GoogleAuthService;
  let networkService:OnlineStatusService;
  let storageService: StorageService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HomeComponent],
      imports: [HttpClientTestingModule,ClientLibRoutingModule,RouterTestingModule.withRoutes([])],
      providers: [BggSearchService,CollectionService,GoogleAuthService,StorageService,
        OnlineStatusService,OAuthService, UrlHelperService, OAuthLogger, DateTimeProvider]
    }).compileComponents();
  });

  it('should create component', () => {
    service = TestBed.inject(BggSearchService);
    router = TestBed.inject(Router);
    collectionService = TestBed.inject(CollectionService);
    component = new HomeComponent(service,router,collectionService,networkService,gapi,storageService);
    expect(component).toBeTruthy();
  });
  it('should create service', ()=>{
    service = TestBed.inject(BggSearchService);
    router = TestBed.inject(Router);
    collectionService = TestBed.inject(CollectionService);
    gapi = TestBed.inject(GoogleAuthService);
    storageService = TestBed.inject(StorageService);
    networkService = TestBed.inject(OnlineStatusService);
    component = new HomeComponent(service,router,collectionService,networkService,gapi,storageService);
    expect(service).toBeTruthy();
  });
  it('should be undefined ids!', ()=>{
    service = TestBed.inject(BggSearchService);
    router = TestBed.inject(Router);
    collectionService = TestBed.inject(CollectionService);
    gapi = TestBed.inject(GoogleAuthService);
    storageService = TestBed.inject(StorageService);
    networkService = TestBed.inject(OnlineStatusService);
    component = new HomeComponent(service,router,collectionService,networkService,gapi,storageService);
    expect(component.ids).toStrictEqual(undefined);
  });

});