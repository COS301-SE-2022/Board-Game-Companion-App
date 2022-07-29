import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { script } from '../../shared/models/script';
import { AdminService } from './admin.service';

const mockData: script[] = [{
  _id: "2",
  name: "tictactoe",
  author: {name:"maEz",email:"doezit@maz.co.za"},
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
  author: {name:"pro",email:"pro@sowe.co.za"},
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
}];

describe('AdminService', () => {
  let service: AdminService;
  let httpTestingController: HttpTestingController;
  
  beforeEach(() => {
    TestBed.configureTestingModule({imports: [HttpClientTestingModule],});
    service = TestBed.inject(AdminService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(()=>{
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should GET scripts from service',()=>{
    service.getScripts().subscribe(data=>{
      expect(data).not.toBe(null);
      expect(data).toBe(mockData);
    });
    const req = httpTestingController.expectOne('http://localhost:3333/api/scripts/retrieve/all');
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });

});
