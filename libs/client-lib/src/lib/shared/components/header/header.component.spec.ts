import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderComponent } from './header.component';

import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BggSearchService } from '../../services/bgg-search/bgg-search.service';
import { OAuthModule } from 'angular-oauth2-oidc';
import { FormsModule } from '@angular/forms';
import { OnlineStatusService } from 'ngx-online-status';
import { AlertService } from '../../services/alert/alert.service';
import { ScriptService } from '../../services/scripts/script.service';
import { CollectionService } from '../../services/collections/collection.service';
import { NotificationComponent } from '../notification/notification.component';
import { SocketIoModule } from 'ngx-socket-io';
// import { WrappedSocket } from 'ngx-socket-io/src/socket-io.service';
describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule,HttpClientTestingModule,OAuthModule.forRoot(),FormsModule,SocketIoModule.forRoot({ url: 'http://localhost:3333/api', options: { transports: ['websocket'], reconnection: true } })],
      declarations: [HeaderComponent,NotificationComponent],
      providers:[BggSearchService,OnlineStatusService,AlertService,ScriptService,CollectionService]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
