import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { AdminService } from './admin.service';
import { automataScript } from '../../shared/models/scripts/automata-script';

const mockAutomata: automataScript[] = [{
  _id: "",
  dateReleased: new Date(0),
  downloads: 0,
  lastDownload: new Date(0),
  export: false,
  comments: [],
  source: { name: "", key: "", location: ""},
  previous: [],
  name: "",
  author: {name:"",email:""},
  boardgame: "",
  description: "",
  version: {major:0,minor:0,patch:0},
  size: 0,
  icon: {name:"",location:"",key:""},
  build: {name:"",location:"",key:""},
  models: [],
  rating:0
}
,{
  _id: "",
  dateReleased: new Date(0),
  downloads: 0,
  lastDownload: new Date(0),
  export: false,
  comments: [],
  source: { name: "", key: "", location: ""},
  previous: [],
  name: "",
  author: {name:"",email:""},
  boardgame: "",
  description: "",
  version: {major:0,minor:0,patch:0},
  size: 0,
  icon: {name:"",location:"",key:""},
  build: {name:"",location:"",key:""},
  models: [],
  rating:0
}];

describe('AdminService', () => {
  let service: AdminService;
  let httpTestingController: HttpTestingController;
  
  beforeEach(() => {
    TestBed.configureTestingModule({imports: [HttpClientTestingModule],});
    service = TestBed.inject(AdminService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should GET scripts from service',()=>{
    service.getScripts().subscribe(data=>{
      expect(data).not.toBe(null);
      expect(data).toBe(mockAutomata);
    });
    const req = httpTestingController.expectOne('http://localhost:3333/api/automata-scripts/retreive-all');
    expect(req.request.method).toBe('GET');
    req.flush(mockAutomata);
  });
});
