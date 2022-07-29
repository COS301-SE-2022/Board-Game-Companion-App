import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OAuthService, UrlHelperService, OAuthLogger, DateTimeProvider } from 'angular-oauth2-oidc';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { GoogleLoginComponent } from './google-login.component';
import { GoogleAuthService } from './GoogleAuth/google-auth.service';

describe('GoogleLoginComponent', () => {
  let component: GoogleLoginComponent;
  let fixture: ComponentFixture<GoogleLoginComponent>;
  let service: GoogleAuthService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GoogleLoginComponent],
      providers: [GoogleAuthService,OAuthService,UrlHelperService,OAuthLogger,DateTimeProvider],
      imports: [HttpClientTestingModule]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GoogleLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    service = TestBed.inject(GoogleAuthService);
  });

  
  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should call the signUserIn()', ()=>{
    expect(component.signUserIn).toBeDefined();
  });

  it('mocking SignIn',()=>{
    component = new GoogleLoginComponent(service);
    service.signIn = jest.fn();
    component.signUserIn();
    expect(service.signIn).toHaveBeenCalled();
  })
});
