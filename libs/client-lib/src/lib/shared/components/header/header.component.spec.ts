import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeaderComponent } from './header.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { BggSearchService } from '../../services/bgg-search/bgg-search.service';
import { OAuthModule } from 'angular-oauth2-oidc';
import { FormsModule } from '@angular/forms';
import { OnlineStatusService } from 'ngx-online-status';
import { AlertService } from '../../services/alert/alert.service';
import { ScriptService } from '../../services/scripts/script.service';
import { CollectionService } from '../../services/collections/collection.service';
import { NotificationComponent } from '../notification/notification.component';
import { SocketIoModule } from 'ngx-socket-io';
import { Router, RouterModule } from '@angular/router';
import { AdminService } from '../../services/admin/admin.service';
describe('HeaderComponent', () => {
  let router: Router;
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterModule,RouterTestingModule,HttpClientModule,OAuthModule.forRoot(),FormsModule,SocketIoModule.forRoot({ url: 'http://localhost:3333/api', options: { transports: ['websocket'], reconnection: true } })],
      declarations: [HeaderComponent,NotificationComponent],
      providers:[BggSearchService,OnlineStatusService,AlertService,ScriptService,CollectionService,AdminService],
      teardown: { destroyAfterEach: false },
    }).compileComponents();
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    router = TestBed.inject(Router);
  });
 
  it('isAdmin??',()=>{
    expect(component.isLoggedIn()).toBeFalsy();
  });

  it('get Time',()=>{
    expect(component.getTime(new Date())).toBeDefined();
    expect(component.getTime(new Date('12-12-2022'))).toBeDefined();
  });
});
