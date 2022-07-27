// describe('Test editor',()=>{
//   it('testing testing',()=>{
//     expect("1").toBe("1");
//   })
// })

// describe('Test editor',()=>{
//   it('testing testing',()=>{
//     expect("1").toBe("1");
//   })
// })

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralComponent } from './general.component';

import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
// import { BggSearchService } from '../../services/bgg-search/bgg-search.service';
import { OAuthModule } from 'angular-oauth2-oidc';
describe('GeneralComponent', () => {
  let component: GeneralComponent;
  let fixture: ComponentFixture<GeneralComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule,HttpClientTestingModule,OAuthModule.forRoot()],
      declarations: [GeneralComponent],
      // providers:[BggSearchService]
    }).compileComponents(); 
    //check if component created
    fixture = TestBed.createComponent(GeneralComponent);
    fixture.detectChanges();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneralComponent);
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


