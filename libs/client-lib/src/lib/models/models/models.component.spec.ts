import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModelsComponent } from './models.component';
import 'fake-indexeddb/auto';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
// import { BggSearchService } from '../../services/bgg-search/bgg-search.service';
import { OAuthModule } from 'angular-oauth2-oidc';
import { GeneralComponent } from '../general/general.component';
import { ModelsService } from '../../shared/services/models/models.service';
import { StorageService } from '../../shared/services/storage/storage.service';
import 'fake-indexeddb/auto';

describe('ModelsComponent', () => {
  let component: ModelsComponent;
  let fixture: ComponentFixture<ModelsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule,HttpClientTestingModule,OAuthModule.forRoot()],
      declarations: [ModelsComponent,GeneralComponent],
      providers:[ModelsService,StorageService]
    }).compileComponents(); 
    //check if component created
    fixture = TestBed.createComponent(ModelsComponent);
    fixture.detectChanges();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModelsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should change tab', () => {
    // expect(component).toBeTruthy();
    component.changeTab(1);
    expect(component.tab).toEqual(1);

    component.changeTab(0);
    expect(component.tab).toEqual(0);
  });
});

