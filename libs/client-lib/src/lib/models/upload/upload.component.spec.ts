import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadComponent } from './upload.component';
import { ModelsService } from '../../shared/services/models/models.service';

import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
// import { BggSearchService } from '../../services/bgg-search/bgg-search.service';
import { OAuthModule } from 'angular-oauth2-oidc';
import { FormsModule } from '@angular/forms';
import { StorageService } from '../../shared/services/storage/storage.service';
import 'fake-indexeddb/auto';
import { NgxPaginationModule } from 'ngx-pagination';
describe('UploadComponent', () => {
  let component: UploadComponent;

  let fixture: ComponentFixture<UploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule,HttpClientTestingModule,OAuthModule.forRoot(),FormsModule,NgxPaginationModule],
      declarations: [UploadComponent],
      providers:[ModelsService,StorageService]
    }).compileComponents(); 

    fixture = TestBed.createComponent(UploadComponent);
    fixture.detectChanges();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create a component', ()=>{
    expect(component).toBeTruthy();
  });
});

