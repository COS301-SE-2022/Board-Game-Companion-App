import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DateTimeProvider, OAuthLogger, OAuthService, UrlHelperService } from 'angular-oauth2-oidc';
import { OnlineStatusService } from 'ngx-online-status';

import { MainScriptsComponent } from './main-scripts.component';

describe('MainScriptsComponent', () => {
  let component: MainScriptsComponent;
  let fixture: ComponentFixture<MainScriptsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MainScriptsComponent],
      providers: [OnlineStatusService,OAuthService,UrlHelperService,OAuthLogger,DateTimeProvider],
      imports: [HttpClientModule,HttpClientTestingModule]
    }).compileComponents();

    fixture = TestBed.createComponent(MainScriptsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
