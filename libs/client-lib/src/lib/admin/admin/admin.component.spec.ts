import { NgxPaginationModule } from 'ngx-pagination';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { AdminComponent } from './admin.component';
import { AdminService } from '../admin-service/admin.service';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';

describe('AdminComponent', () => {
  let component: AdminComponent;
  let fixture: ComponentFixture<AdminComponent>;
  let service: AdminService;
  let router: Router;
  let route: ActivatedRoute;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminComponent],
      providers: [AdminService],
      imports: [HttpClientTestingModule,RouterTestingModule,NgxPaginationModule]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminComponent);
    component = fixture.componentInstance;
    component.scripts = [];
    fixture.detectChanges();
    service = TestBed.inject(AdminService);
    router = TestBed.inject(Router);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to the editor', () =>{
    component = new AdminComponent(service,router,route);
    // component.scripts = [];
    const navigateSpy = jest.spyOn(router,'navigate');
    component.onEdit('chess_script','12345');
    expect(navigateSpy).toHaveBeenCalledWith(['editor',{id:'12345',filename:'chess_script'}]);
  });

  it('should navigate to the comment section', () =>{
    component = new AdminComponent(service,router,route);
    // component.scripts = [];
    const navigateSpy =  jest.spyOn(router,'navigate');
    component.onComment('chess_script', '12345');
    expect(navigateSpy).toHaveBeenCalledWith(['script-detail',{id:'12345',filename:'chess_script'}]);
  });

  jest.mock('../admin-service/admin.service');
  AdminService.prototype.getScripts = function(){
    return of([{
      _id: "2",
      name: "tictactoe",
      author: {name:"Njabulo",email:"jsjs@gmail.com"},
      owner: {name:"",email:""},
      boardgame: "",
      description: "",
      created: new Date("05-03-19"),
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
      _id: "1",
      name: "chess",
      author: {name:"PRO",email:"kid@yahoo.com"},
      owner: {name:"",email:""},
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
      _id: "3",
      name: "root",
      author: {name:"Master",email:"masterInd@gmail.com"},
      owner: {name:"",email:""},
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
    }]);
  }

  it('should have array of length 3', ()=>{
    component.findAll();
    expect(component.scripts.length).toBe(3);
  });

  it('should return current month', ()=>{
    component.currentMonth();
    expect(component.scripts.length).toBe(0);
    component.findAll();
    expect(component.scripts.length).toBe(3);
  });

  it('should return running scripts', ()=>{
    component.runningScripts();
    expect(component.scripts.length).toBe(1);
  });

  it('should return flagged scripts', ()=>{
    component.flaggedScripts();
    expect(component.scripts.length).toBe(1);
  });

  it('should return progressing scripts', ()=>{
    component.ProgressScripts();
    expect(component.scripts.length).toBe(1);
  });

  it('should search script by name', ()=>{
    component.findAll();
    component.searchedValue = 'root';
    component.onSearch();
    expect(component.scripts.length).toBe(1);
    component.searchedValue = 'z';
    component.onSearch();
    expect(component.scripts.length).toBe(0);
  });

  it('should sort by date and alphabet', ()=>{
    component.findAll();
    component.selected = 'alphabetical';
    component.onSort();
    expect(component.scripts[1].name).toBe('root');
    component.selected = 'date';
    component.onSort();
    expect(component.scripts[0].name).toBe('chess');
    expect(component.scripts[1].name).toBe('tictactoe');
    expect(component.scripts[2].name).toBe('root');
  });

});
