import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfigureComponent } from './configure.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { StorageService } from '../../shared/services/storage/storage.service';
import { OAuthModule } from 'angular-oauth2-oidc';
import { GeneralComponent } from '../general/general.component';
import { ModelsService } from '../../shared/services/models/models.service';
import 'fake-indexeddb/auto';
import { OnlineStatusService } from 'ngx-online-status';
describe('ConfigureComponent', () => {
  let component: ConfigureComponent;
  let fixture: ComponentFixture<ConfigureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule,HttpClientTestingModule,OAuthModule.forRoot()],
      declarations: [ConfigureComponent,GeneralComponent],
      providers:[ModelsService,StorageService,OnlineStatusService]
    }).compileComponents(); 
    fixture = TestBed.createComponent(ConfigureComponent);
    fixture.detectChanges();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should change tab', () => {
    expect(component).toBeTruthy();
  });
});

