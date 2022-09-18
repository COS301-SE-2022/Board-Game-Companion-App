import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModelsService } from '../../shared/services/models/models.service';
import { StorageService } from '../../shared/services/storage/storage.service';
import { AutomataScriptComponent } from './automata-scripts.component';
import 'fake-indexeddb/auto';
import { ScriptService } from '../../shared/services/scripts/script.service';
import { GoogleAuthService } from '../../google-login/GoogleAuth/google-auth.service';
import { OAuthLogger, OAuthService, UrlHelperService, DateTimeProvider } from 'angular-oauth2-oidc';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { OnlineStatusService } from 'ngx-online-status';
import { NgxPaginationModule } from 'ngx-pagination';

describe('AutomataScriptComponent', () => {
  let component: AutomataScriptComponent;
  let fixture: ComponentFixture<AutomataScriptComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AutomataScriptComponent],
      providers: [ScriptService,GoogleAuthService,OAuthLogger,OAuthService,
        UrlHelperService,DateTimeProvider,StorageService,ModelsService,OnlineStatusService],
      imports: [RouterTestingModule,HttpClientTestingModule,NgxPaginationModule]
    }).compileComponents();

    fixture = TestBed.createComponent(AutomataScriptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
