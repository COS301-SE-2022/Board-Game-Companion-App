// describe('Test editor',()=>{
//   it('testing testing',()=>{
//     expect("1").toBe("1");
//   })
// })

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigureComponent } from './configure.component';

import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
// import { BggSearchService } from '../../services/bgg-search/bgg-search.service';
import { OAuthModule } from 'angular-oauth2-oidc';
import { GeneralComponent } from '../general/general.component';
import { ModelsService } from '../../shared/services/models/models.service';
describe('ConfigureComponent', () => {
  let component: ConfigureComponent;
  let fixture: ComponentFixture<ConfigureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule,HttpClientTestingModule,OAuthModule.forRoot()],
      declarations: [ConfigureComponent,GeneralComponent],
      providers:[ModelsService]
    }).compileComponents(); 
    //check if component created
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

