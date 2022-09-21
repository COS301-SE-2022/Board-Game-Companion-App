import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReportService } from './report.service';

describe('Test service',()=>{

  let service: ReportService;

  beforeEach(()=>{
    TestBed.configureTestingModule({imports:[HttpClientTestingModule],providers:[ReportService]});
    service = TestBed.inject(ReportService);
  });

  it('should create a service',()=>{
    expect(service).toBeTruthy();
  });

});