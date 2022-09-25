import { async, ComponentFixture, inject, TestBed, waitForAsync } from '@angular/core/testing';
import { ModelsService } from '../../shared/services/models/models.service';
import { StorageService } from '../../shared/services/storage/storage.service';
import { AutomataScriptComponent } from './automata-scripts.component';
import 'fake-indexeddb/auto';
import { ScriptService } from '../../shared/services/scripts/script.service';
import { GoogleAuthService } from '../../google-login/GoogleAuth/google-auth.service';
import { OAuthLogger, OAuthService, UrlHelperService, DateTimeProvider } from 'angular-oauth2-oidc';
import { RouterTestingModule } from '@angular/router/testing';
import { OnlineStatusService } from 'ngx-online-status';
import { NgxPaginationModule } from 'ngx-pagination';
import { NotificationComponent } from '../../shared/components/notification/notification.component';
import { of } from 'rxjs';
import { automataScript } from '../../shared/models/scripts/automata-script';
import { Router } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
/****************************************************** Unit Tests *************************************************************/
describe('AutomataScriptComponent', () => {
  let component: AutomataScriptComponent;
  let fixture: ComponentFixture<AutomataScriptComponent>;
  jest.mock('../../google-login/GoogleAuth/google-auth.service');
  jest.mock('../../shared/services/scripts/script.service');
  const autoScript:automataScript[]=[{
    _id:'6329b8f795de07e4c0370183',
    dateReleased:  new Date('2022-09-20T12:58:31.859+00:00'),
    downloads: 123,
    lastDownload: new Date('2022-09-20T12:59:14.330+00:00'),
    export: false,
    comments: [],
    rating: 0,
    source: { name: "", key: "", location: ""},
    previous: [],
    name:'tic',
    author: {name: 'The Wot',email:'kylehaarhoff101@gmail.com'},
    boardgame: '42336',
    description: '',
    version:{major:1,minor:0,patch:0},
    size: 123,
    icon: {name:'',location:'',key:''},
    build: {name:"",location:"",key:""},
    models: [],
  }];
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AutomataScriptComponent,NotificationComponent],
      providers: [{provide:ScriptService,useValue:{getAutomataScripts:jest.fn().mockImplementation(()=>{return of()}),alreadyDownloaded:jest.fn().mockImplementation(()=>{return true})}},
        {provide:GoogleAuthService,useValue:{isLoggedIn:jest.fn().mockImplementation(()=>{return of(true)})}},OAuthLogger,OAuthService,
        UrlHelperService,DateTimeProvider,StorageService,ModelsService,OnlineStatusService],
      imports: [RouterTestingModule,HttpClientTestingModule,NgxPaginationModule]
    }).compileComponents();
    fixture = TestBed.createComponent(AutomataScriptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // jest.mock('../../google-login/GoogleAuth/google-auth.service');
  // GoogleAuthService.prototype.isLoggedIn = function(){
  //   return true;
  // }
  // GoogleAuthService.prototype.signOut = function(){
  //   return true;
  // }

  it('should create',() => {
    expect(component).toBeTruthy();
  });

  it('should getAutomata Scripts',waitForAsync(()=>{
    window.sessionStorage.setItem('email','Dt3879@gmail.com');
    const serv = TestBed.inject(ScriptService);

    const spyGET = jest.spyOn(serv,'getAutomataScripts');

    component.getAutomataScripts();
    component.checkAlreadyDownloaded();
    component.checkShowImports();

    expect(spyGET).toHaveBeenCalled();
    
    component.search('');
    expect(component.filter.length).toEqual(component.scripts.length);
    component.search('TestingScript');
    expect(component.filter.length).toEqual(0);

  }));

  it('routes tests',()=>{
    const router = TestBed.inject(Router);
    const navRoute = jest.spyOn(router,'navigate');
    
    component.showInfo(autoScript[0]);
    expect(navRoute).toHaveBeenCalledWith(['script-detail'], { state: { value: autoScript[0] } });
    component.showEditor(autoScript[0]);
    expect(navRoute).toHaveBeenCalledWith(['editor'],{ state: { value: autoScript[0] } });
    component.play(autoScript[0]);
    expect(navRoute).toHaveBeenCalledWith(['script-exec'], { state: { value: autoScript[0] } });
  });

});
