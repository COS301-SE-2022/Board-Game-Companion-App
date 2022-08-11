// describe('Test editor',()=>{
//   it('testing testing',()=>{
//     expect("1").toBe("1");
//   })
// })

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadDataComponent } from './load-data.component';

import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
// import { BggSearchService } from '../../services/bgg-search/bgg-search.service';
import { OAuthModule } from 'angular-oauth2-oidc';
import { GeneralComponent } from '../general/general.component';
import { ModelsService } from '../../shared/services/models/models.service';
describe('LoadDataComponent', () => {
  let component: LoadDataComponent;
  let fixture: ComponentFixture<LoadDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule,HttpClientTestingModule,OAuthModule.forRoot()],
      declarations: [LoadDataComponent,GeneralComponent],
      providers:[ModelsService]
    }).compileComponents(); 
    //check if component created
    fixture = TestBed.createComponent(LoadDataComponent);
    fixture.detectChanges();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should change tab', () => {
    expect(component).toBeTruthy();
  });
});

