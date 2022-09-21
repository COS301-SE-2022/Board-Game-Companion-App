import { ScriptService } from '../../shared/services/scripts/script.service';
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { OnlineStatusService } from 'ngx-online-status';
import { GoogleAuthService } from '../../google-login/GoogleAuth/google-auth.service';
import { CollectionService } from '../../shared/services/collections/collection.service';
import { CreateCollectionComponent } from './create-collection.component';
import { NotificationComponent } from '../../shared/components/notification/notification.component';
import { DateTimeProvider, OAuthLogger, OAuthService, UrlHelperService } from 'angular-oauth2-oidc';

describe('CreateCollectionComponent',()=>{
  let component: CreateCollectionComponent;
  let searchAuth: GoogleAuthService;
  let serviceNetwork: OnlineStatusService;
  let serviceCollection: CollectionService;

  beforeEach(async ()=> {
    await TestBed.configureTestingModule({
      declarations: [CreateCollectionComponent,NotificationComponent],
      providers: [CollectionService,OnlineStatusService,GoogleAuthService,OAuthService,UrlHelperService,OAuthLogger,DateTimeProvider],
      imports: [HttpClientTestingModule]
    }).compileComponents();
  });

  it('should create component',()=>{
    searchAuth = TestBed.inject(GoogleAuthService);
    serviceCollection = TestBed.inject(CollectionService);
    serviceNetwork = TestBed.inject(OnlineStatusService);
    expect(serviceNetwork).toBeDefined();
    expect(serviceCollection).toBeDefined();
    expect(searchAuth).toBeDefined();
    component = new CreateCollectionComponent(serviceCollection,searchAuth,serviceNetwork);
    expect(component).toBeDefined();
  });
});