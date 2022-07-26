import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationUnitComponent } from './notification-unit.component';

import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BggSearchService } from '../../services/bgg-search/bgg-search.service';
import { OAuthModule } from 'angular-oauth2-oidc';
describe('NotificationUnit', () => {
  let component: NotificationUnitComponent;
  let fixture: ComponentFixture<NotificationUnitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule,HttpClientTestingModule,OAuthModule.forRoot()],
      declarations: [NotificationUnitComponent],
      providers:[BggSearchService]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationUnitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
