import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AlertService } from './alert.service';

describe('Test service',()=>{

  let service: AlertService;

  beforeEach(()=>{
    TestBed.configureTestingModule({imports:[HttpClientTestingModule],providers:[AlertService]});
    service = TestBed.inject(AlertService);
  });

  it('should create a service',()=>{
    expect(service).toBeTruthy();
  });

});