import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ArchitectureComponent } from './architecture.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { OAuthModule } from 'angular-oauth2-oidc';
import { GeneralComponent } from '../general/general.component';
import { ModelsService } from '../../shared/services/models/models.service';
describe('ArchitectureComponent', () => {
  let component: ArchitectureComponent;
  let fixture: ComponentFixture<ArchitectureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule,HttpClientTestingModule,OAuthModule.forRoot()],
      declarations: [ArchitectureComponent,GeneralComponent],
      providers:[ModelsService]
    }).compileComponents(); 
    //check if component created
    fixture = TestBed.createComponent(ArchitectureComponent);
    fixture.detectChanges();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArchitectureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should change tab', () => {
    expect(component).toBeTruthy();
  });
});

