import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { DownloadsService } from './downloads.service';

describe('Test script service',()=>{

  let service: DownloadsService;
  let httpTestingController: HttpTestingController;

  beforeEach(()=>{
    TestBed.configureTestingModule({imports:[HttpClientTestingModule],providers:[DownloadsService]});
    service = TestBed.inject(DownloadsService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(()=>{
    httpTestingController.verify();
  });

  it('should create',()=>{
    expect(service).toBeTruthy();
  });

});