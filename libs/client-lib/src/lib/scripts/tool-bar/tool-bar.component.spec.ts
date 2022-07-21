import { TestBed } from '@angular/core/testing';
import { script, empty} from '../../shared/models/script';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { GoogleAuthService, userDetails } from '../../google-login/GoogleAuth/google-auth.service';
import { ToolBarComponent } from './tool-bar.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { EventEmitter } from 'stream';
import { of, Subject } from 'rxjs';
import { file } from '../../shared/models/file';
import { DateTimeProvider, OAuthLogger, OAuthService, UrlHelperService } from 'angular-oauth2-oidc';

const mockDetails: userDetails = {
  details:
  {
    sub: "",
    email: "njabuloNtuli@gmail.com",
    name: "Njabulo",
    img: "google.com/img/njabulo.jpg"
  }
}
const testScript: script = {
  _id:"1",
  name: "chess",
  author: "",
  boardgame: "",
  description: "",
  created: new Date(0),
  release: new Date(0),
  downloads: 0,
  lastdownload: new Date(0),
  lastupdate: new Date(0),
  public: true,
  export: true,
  size: 0,
  status: {
    value:1,
    message: "so"
  },
  comments: [],
  files: [{
      name: "",
      awsKey: "",
      location: ""
    }],
  icon: "",
  __v: 0
};
describe('ToolBarComponent',()=>{
  let component: ToolBarComponent;
  let service: GoogleAuthService;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ToolBarComponent],
      imports: [HttpClientTestingModule,RouterTestingModule],
      providers: [GoogleAuthService,OAuthService,UrlHelperService,OAuthLogger,DateTimeProvider]});
      service = TestBed.inject(GoogleAuthService);
      router = TestBed.inject(Router);
      component = new ToolBarComponent(router,service);
  });

  it('should create component, service and router',()=>{
    expect(component).toBeDefined();
    expect(service).toBeDefined();
    expect(router).toBeDefined();
  });

  it('define variables',()=>{
    expect(component.viewEvent).toBeDefined();
    expect(component.newScript).toBeDefined();
    expect(component.removeScript).toBeDefined();
    expect(component.searchValueEvent).toBeDefined();
    expect(component.searchValue).toBe("");
    expect(component.current).toBe(empty);
    expect(component.loggedIn).toBe(false);
    expect(component.UserDetails).toBe(undefined);
  });

  jest.mock('../../google-login/GoogleAuth/google-auth.service');
  GoogleAuthService.prototype.UserSubject = new Subject<userDetails>();
  GoogleAuthService.prototype.isLoggedIn = function(){
    return true;
  }
  it('test the constructor',()=>{
    service.UserSubject.next(mockDetails);
  });

  it('should loggedIn',()=>{
    component.ngOnInit();
    expect(component.loggedIn).toBe(true);
    component.loggedIn = false;
    expect(component.loggedIn).toBe(false);
  });

  it('should ngOnChanges()',()=>{
    expect(component.ngOnChanges).toBeDefined();
    // component.ngOnChanges();
  });

  it('should changeView(boolean)',()=>{
    expect(component.changeView).toBeDefined();
    component.changeView(true);
  });

  it('should propagateScript(script)',()=>{
    expect(component.propagateScript).toBeDefined();
    component.propagateScript(empty);
  });

  it('should removeCurrentScript()',()=>{
    expect(component.removeCurrentScript).toBeDefined();
    component.removeCurrentScript();
  });

  it('should updateScript()', ()=>{
    expect(component.current.name).toBe("");
    expect(component.current.public).toBe(false);
    expect(component.current.export).toBe(false);

    component.updateScript(testScript);

    expect(component.current._id).not.toBe(testScript._id);
    expect(component.current.name).toBe(testScript.name);
    expect(component.current.public).toBe(testScript.public);
    expect(component.current.export).toBe(testScript.export);
  });

  it('should return copy(:script) of script',()=>{
    const value: script = component.copy(empty);
    expect(value).toStrictEqual(JSON.parse(JSON.stringify(component.current)));
  });

  it('should emit searchValue',()=>{
    expect(component.search).toBeDefined();
    component.searchValue = "games";
    component.search();
  });

  it('should navigate to the Editor',()=>{
    const navigateSpy = jest.spyOn(router, 'navigate');
    expect(component.navigateToEditor).toBeDefined();
    component.navigateToEditor("main.ts");
    expect(navigateSpy).toHaveBeenCalledWith(['editor'],{state: {filename:"main.ts",id:""}});
  });

  it('navigate to scriptExecutor',()=>{
    const navigateSpy = jest.spyOn(router, 'navigate');
    component.play();
    expect(navigateSpy).toHaveBeenCalledWith(['scriptExecutor',{my_object: ''}]);
  });

});
