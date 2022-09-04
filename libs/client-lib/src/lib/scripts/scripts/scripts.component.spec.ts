import { HttpClientTestingModule } from '@angular/common/http/testing';
import { empty,script } from '../../shared/models/scripts/script';
import { TestBed } from '@angular/core/testing';
import { ScriptService } from '../../shared/services/scripts/script.service';
import { ScriptsComponent } from './scripts.component';
import { of } from 'rxjs';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { GoogleAuthService } from '../../google-login/GoogleAuth/google-auth.service';
import { OAuthService, UrlHelperService, OAuthLogger, DateTimeProvider } from 'angular-oauth2-oidc';

let mockScripts: script[] =[{
  _id: "1",
  name: "chess",
  author: {name:"PRo",email:"pro@gmail.com"},
  owner:{name:"wr",email:"wr@yahoo.co.za"},
  boardgame: "",
  description: "",
  created: new Date(0),
  release: new Date(0),
  downloads: 32,
  lastdownload: new Date(0),
  lastupdate: new Date(0),
  public: false,
  export: false,
  size: 233,
  status: {value: 0, message: "flagged"},
  comments: [],
  source: {name:"",location:"",awsKey:""},
  build: {name:"",location:"",awsKey:""},
  icon: {name:"",location:"",awsKey:""},
  __v: 0
},{
  _id: "2",
  name: "tictactoe",
  author: {name:"njabs",email:"njabs@yahoo.co.za"},
  owner: {name:"yem",email:"yem@scripts.co.za"},
  boardgame: "",
  description: "",
  created: new Date("20-03-19"),
  release: new Date("15-08-19"),
  downloads: 500,
  lastdownload: new Date("05-07-22"),
  lastupdate: new Date("13-12-21"),
  public: true,
  export: false,
  size: 344,
  status: {value: 1, message: "Active and running"},
  comments: [],
  source: {name:"",location:"",awsKey:""},
  build: {name:"",location:"",awsKey:""},
  icon: {name:"",location:"",awsKey:""},
  __v: 0
},{
  _id: "3",
  name: "root",
  author: {name:"Master",email:"Master@boards.co.za"},
  owner: {name:"yem",email:"yem@scripts.co.za"},
  boardgame: "",
  description: "",
  created: new Date("01-04-20"),
  release: new Date("13-09-20"),
  downloads: 0,
  lastdownload: new Date("07-07-22"),
  lastupdate: new Date("12-10-21"),
  public: false,
  export: false,
  size: 320,
  status: {value: 2, message: "In progress"},
  comments: [],
  source: {name:"",location:"",awsKey:""},
  build: {name:"",location:"",awsKey:""},
  icon: {name:"",location:"",awsKey:""},
  __v: 0
},{
  _id: "4",
  name: "monopoly",
  author: {name:"gamer",email:"games@boards.co.za"},
  owner: {name:"yemes",email:"best@scripts.co.za"},
  boardgame: "",
  description: "",
  created: new Date("01-04-20"),
  release: new Date("13-09-20"),
  downloads: 0,
  lastdownload: new Date("07-07-22"),
  lastupdate: new Date("12-10-21"),
  public: false,
  export: false,
  size: 432,
  status: {value: 1, message: "Running"},
  comments: [],
  source: {name:"",location:"",awsKey:""},
  build: {name:"",location:"",awsKey:""},
  icon: {name:"",location:"",awsKey:""},
  __v: 0
}];

const createdScripts:script[]=[mockScripts[0]];
const downloadedScripts:script[]=[mockScripts[1],mockScripts[2]];
const otherScripts:script[]=[mockScripts[2],mockScripts[1]];


describe('ScriptsComponent',()=>{
  let component: ScriptsComponent;
  let scriptService: ScriptService;
  let googleService: GoogleAuthService;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ScriptsComponent],
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [ScriptService, GoogleAuthService, OAuthService, UrlHelperService, OAuthLogger, DateTimeProvider]});
      scriptService = TestBed.inject(ScriptService);
      googleService = TestBed.inject(GoogleAuthService);
      router = TestBed.inject(Router);
      component = new ScriptsComponent(scriptService, router, googleService);
  });

  jest.mock('../../shared/services/scripts/script.service');
  // mock first function retrieveAllScript();
  ScriptService.prototype.retrieveAllScript = function(){
    return of(mockScripts);
  }

  ScriptService.prototype.getScriptsCreatedByMe = function(value){
    return of(createdScripts);
  }

  ScriptService.prototype.getScriptsDownloadedByMe = function(value){
    return of(downloadedScripts);
  }

  ScriptService.prototype.getOther = function(value){
    return of(otherScripts);
  }

  ScriptService.prototype.removeScript = function(value){
    mockScripts = mockScripts.filter(obj => {return obj._id !== value});
    return of();
  }

  // mock second function getApiUrl();
  ScriptService.prototype.getApiUrl = function(){
    return "http://localhost:3333/api/";
  }
  it('should create a Scripts component',()=>{
    expect(component).toBeDefined();
    expect(scriptService).toBeDefined();
    expect(googleService).toBeDefined();
  });

  it('should load all existing scripts',()=>{
    component.loadAllScripts();
    expect(component.scripts.length).toBe(5);
    expect(component.creationStore).toStrictEqual([mockScripts[0]]);
    // expect(component.scripts).toBe(mockScripts);
    expect(component.creationStore.length).toBe(1);
  });

  it('should have initialized variables',()=>{
    expect(component.scripts).toStrictEqual([]);
    expect(component.creationStore).toStrictEqual([]);
    expect(component.currentScript).toBe(empty);
    expect(component.gridView).toBe(true);
    expect(component.months.length).toBe(12);
  });

  it('should define all functions in the component', ()=>{
    expect(component.removeScript).toBeDefined();
    expect(component.newScript).toBeDefined();
    expect(component.containerClick).toBeDefined();
    expect(component.changeView).toBeDefined();
    expect(component.search).toBeDefined();
    expect(component.selected).toBeDefined();
    expect(component.formatDate).toBeDefined();
    expect(component.replaceBackSlash).toBeDefined();
    expect(component.loadAllScripts).toBeDefined();
    expect(component.ngOnInit).toBeDefined();
  });

  it('formatDate() should return formated-Date',()=>{
    component.loadAllScripts();
    const date = component.formatDate(new Date('05-07-22'));
    expect(date).toBe('07 May 2022, 00:00:00');
  });

  it('selected() should assign chosen script', ()=>{
    component.loadAllScripts();
    component.selected(mockScripts[0]);
    expect(component.currentScript).toBe(mockScripts[0]);
    expect(component.currentScript.name).toBe(mockScripts[0].name);
  });

  it('search() should return script search by name',()=>{
    component.loadAllScripts();
    component.searchValue = "chess";
    component.search();
    expect(component.scripts.length).toBe(1);
    expect(component.scripts[0]).toBe(mockScripts[0]);
  });

  it('search() should return assign store if value is ""',()=>{
    component.loadAllScripts();
    component.searchValue = "";
    component.search();
    expect(component.scripts.length).toBe(1);
    expect(component.scripts[0]).toBe(mockScripts[0]);
  });

  it('changeView()',()=>{
    // component.loadAllScripts();
    component.changeView(false);
    expect(component.gridView).toBe(false);
  });

  it('newScript() should add new script to the array',()=>{
    component.loadAllScripts();
    component.newScript({
      _id: "4",
      name: "umrabaraba",
      author: {name:"PRo",email:"pro@gmail.com"},
      owner: {name:"GWAN",email:"GWEN@creator.biz"},
      boardgame: "",
      description: "",
      created: new Date("20-03-19"),
      release: new Date("15-08-19"),
      downloads: 500,
      lastdownload: new Date("05-07-22"),
      lastupdate: new Date("13-12-21"),
      public: true,
      export: true,
      size: 514,
      status: {value: 1, message: "Active and running"},
      comments: [],
      source: {name:"",location:"",awsKey:""},
      build: {name:"",location:"",awsKey:""},
      icon: {name:"",location:"",awsKey:""},
      __v: 0});

      expect(component.scripts.length).toBe(6);
      expect(component.creationStore.length).toBe(1);
  });

  it('removeScript() should remove and re-assign',()=>{
    component.loadAllScripts();
    component.removeScript(mockScripts[2]);
    expect(component.currentScript).toBe(empty);
  });

});