import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OnlineStatusService } from 'ngx-online-status';
import { OAuthLogger, OAuthService, UrlHelperService, DateTimeProvider } from 'angular-oauth2-oidc';
import { DownloadScriptsComponent } from './download-scripts.component';
import { ModelsService } from '../../shared/services/models/models.service';
import { ScriptService } from '../../shared/services/scripts/script.service';
import { StorageService } from '../../shared/services/storage/storage.service';
import { NgxPaginationModule } from 'ngx-pagination';
import 'fake-indexeddb/auto';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NotificationComponent } from '../../shared/components/notification/notification.component';

describe('DownloadPageComponent', () => {
  let component: DownloadScriptsComponent;
  let fixture: ComponentFixture<DownloadScriptsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DownloadScriptsComponent,NotificationComponent],
      providers: [StorageService,ScriptService,ModelsService,
        OAuthLogger,OAuthService,UrlHelperService,DateTimeProvider,OnlineStatusService],
      imports: [NgxPaginationModule,HttpClientTestingModule,RouterTestingModule]
    }).compileComponents();

    fixture = TestBed.createComponent(DownloadScriptsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
