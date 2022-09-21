import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoadDataComponent } from './load-data.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { OAuthModule } from 'angular-oauth2-oidc';
import { GeneralComponent } from '../general/general.component';
import { ModelsService } from '../../shared/services/models/models.service';
import { StorageService } from '../../shared/services/storage/storage.service';
import 'fake-indexeddb/auto';
import { NotificationComponent } from '../../shared/components/notification/notification.component';
import { FormsModule } from '@angular/forms';
describe('LoadDataComponent', () => {
  let component: LoadDataComponent;
  let fixture: ComponentFixture<LoadDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule,HttpClientTestingModule,OAuthModule.forRoot(),FormsModule],
      declarations: [LoadDataComponent,GeneralComponent,NotificationComponent],
      providers:[ModelsService,StorageService]
    }).compileComponents(); 
    fixture = TestBed.createComponent(LoadDataComponent);
    fixture.detectChanges();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

