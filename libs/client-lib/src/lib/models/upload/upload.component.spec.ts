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

import { UploadComponent } from './upload.component';
import { ModelsService } from '../../shared/services/models/models.service';

import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
// import { BggSearchService } from '../../services/bgg-search/bgg-search.service';
import { OAuthModule } from 'angular-oauth2-oidc';
import { FormsModule } from '@angular/forms';
describe('UploadComponent', () => {
  let component: UploadComponent;
  //let modService: ModelsService;
  let fixture: ComponentFixture<UploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule,HttpClientTestingModule,OAuthModule.forRoot(),FormsModule],
      declarations: [UploadComponent],
      providers:[ModelsService]
    }).compileComponents(); 
    //check if component created
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

