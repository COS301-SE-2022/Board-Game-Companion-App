import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { DateTimeProvider, OAuthLogger, OAuthService, UrlHelperService } from 'angular-oauth2-oidc';
import { OnlineStatusService } from 'ngx-online-status';
import { routes } from '../../client-lib-routing.module';
import { GoogleAuthService } from '../../google-login/GoogleAuth/google-auth.service';
import { CollectionService } from '../../shared/services/collections/collection.service';
import { StorageService } from '../../shared/services/storage/storage.service';
import { AddToCollectionComponent } from './add-to-collection.component';
import 'fake-indexeddb/auto';
import { NotificationComponent } from '../../shared/components/notification/notification.component';

let store: any = {};
describe('AddToCollectionComponent', () => {
  let component: AddToCollectionComponent;
  let fixture: ComponentFixture<AddToCollectionComponent>;

  beforeEach(async ()=> {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes(routes),HttpClientModule,HttpClientTestingModule],
      providers: [{provide: ActivatedRoute, useValue:
        { snapshot: { paramMap: convertToParamMap( { 'id': '998877' } ) } } },CollectionService
        ,StorageService,GoogleAuthService,OnlineStatusService,OAuthService,UrlHelperService,
        OAuthLogger,DateTimeProvider]
      ,declarations: [AddToCollectionComponent,NotificationComponent]
    }).compileComponents();
  });
  beforeEach(()=> {

    const mockLocalStorage = {
      getItem: (key: string): string => {
      return key in store ? store[key] : null },

      setItem: (key: string, value: string) => {
      store[key] = `${value}`;},

      removeItem: (key: string) => {
      delete store[key];},

      clear: () => {
        store = {};
      }
    };

    Object.defineProperty(window, 'localStorage', {
      value: mockLocalStorage
    })

  });

  it('should create', ()=>{
    fixture = TestBed.createComponent(AddToCollectionComponent);
    component =  fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  it('options should have empty array', ()=>{
    fixture = TestBed.createComponent(AddToCollectionComponent);
    component =  fixture.componentInstance;
    expect(component.options).toEqual([]);
  });
});
