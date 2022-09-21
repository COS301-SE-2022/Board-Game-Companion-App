import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { DateTimeProvider, OAuthLogger, OAuthService, UrlHelperService } from 'angular-oauth2-oidc';
import { OnlineStatusService } from 'ngx-online-status';
import { NgxPaginationModule } from 'ngx-pagination';
import { NotificationComponent } from '../../shared/components/notification/notification.component';
import { BggSearchService } from '../../shared/services/bgg-search/bgg-search.service';
import { ScriptService } from '../../shared/services/scripts/script.service';
import { CreateScriptComponent } from '../create-script/create-scripts.component';
import { MyScriptsComponent } from '../my-scripts/my-scripts.component';

import { MainScriptsComponent } from './main-scripts.component';

describe('MainScriptsComponent', () => {
  let component: MainScriptsComponent;
  let fixture: ComponentFixture<MainScriptsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MainScriptsComponent,CreateScriptComponent,
        NotificationComponent,MyScriptsComponent],
      providers: [OnlineStatusService,OAuthService,UrlHelperService,OAuthLogger,
        BggSearchService,DateTimeProvider,ScriptService],
      imports: [HttpClientModule,HttpClientTestingModule,FormsModule,
        RouterTestingModule,NgxPaginationModule]
    }).compileComponents();

    fixture = TestBed.createComponent(MainScriptsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
