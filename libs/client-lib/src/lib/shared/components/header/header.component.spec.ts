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
/**************************************** Integration tests ********************************************************/
describe('HeaderComponent', () => {
  let router: Router;
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterModule,RouterTestingModule,HttpClientModule,OAuthModule.forRoot(),FormsModule,SocketIoModule.forRoot({ url: 'http://localhost:3333/api', options: { transports: ['websocket'], reconnection: true } })],
      declarations: [HeaderComponent,NotificationComponent],
      providers:[BggSearchService,OnlineStatusService,AlertService,ScriptService,CollectionService],
      teardown: { destroyAfterEach: false },
    }).compileComponents();
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    router = TestBed.inject(Router);
  });
 
  it('should create', (done) => {
    expect(component).toBeTruthy();
    const navigateToHome = jest.spyOn(router,'navigate');
    component.ngOnInit();
    expect(navigateToHome).toHaveBeenCalledWith(['/home']);

    component.onScreenResize();
    expect(component.ShowMenu).toBeFalsy();
    done();
  });

  it('isAdmin??',()=>{
    expect(component.isLoggedIn()).toBeFalsy();
  });

  it('moveTo(path)',()=>{
    const navigatePath = jest.spyOn(router,'navigate');
    component.moveTo('collection');
    expect(navigatePath).toHaveBeenCalledWith(['/home']);

    component.moveTo('login');
    expect(navigatePath).toHaveBeenCalledWith(['/login']);

    component.moveTo('logout');
    expect(navigatePath).toHaveBeenCalledWith(['/home']);

    component.moveTo('board-game-search');
    expect(navigatePath).toHaveBeenCalledWith(['/board-game-search',{value:''}]);

    component.moveTo('admin');
    expect(navigatePath).toHaveBeenCalledWith(['/admin']);
  });

  it('ngDoCheck',()=>{
    component.ngDoCheck();
    expect(component.log).toBe('login');
  });

  it('get Time',()=>{
    expect(component.getTime(new Date())).toBeDefined();
    expect(component.getTime(new Date('12-12-2022'))).toBeDefined();
  });

  it('process alert',(done)=>{
    component.processAlert({
      subject: '',
      message: '',
      alert:{
        _id: '6326f2d9562682f72538198d',
        recepient: {name:'Matome Makgopa',email:'matomemakgopa64@gmail.com'},
        date: new Date('2022-09-18T10:28:41.795+00:00'),
        link: '6326f2d9562682f725381972@18212',
        alertType: 0,
        read: true,
      },
    })
    done();
  });

  it('create a collection',(done)=>{
    component.createFavouritesCollection();
    done();
  });

  it('receiveAlerts',(done)=>{
    component.receiveAlerts();
    done();
    
  });

  it('get Alerts',(done)=>{
    component.getAlerts();
    done();
  });

});
