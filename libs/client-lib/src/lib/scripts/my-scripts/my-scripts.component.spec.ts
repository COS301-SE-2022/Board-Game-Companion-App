import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ScriptService } from '../../shared/services/scripts/script.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MyScriptsComponent } from './my-scripts.component';
import { RouterTestingModule } from '@angular/router/testing';
import { OnlineStatusService } from 'ngx-online-status';
import { OAuthLogger, OAuthService, UrlHelperService, DateTimeProvider } from 'angular-oauth2-oidc';
import { BggSearchService } from '../../shared/services/bgg-search/bgg-search.service';
import { NotificationComponent } from '../../shared/components/notification/notification.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormsModule } from '@angular/forms';

describe('MyScriptsComponent', () => {
  let component: MyScriptsComponent;
  let fixture: ComponentFixture<MyScriptsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MyScriptsComponent,NotificationComponent],
      providers: [ScriptService,OnlineStatusService,OAuthService,UrlHelperService,OAuthLogger,DateTimeProvider,BggSearchService],
      imports: [HttpClientTestingModule,RouterTestingModule,NgxPaginationModule,FormsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(MyScriptsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
