import { TestBed } from '@angular/core/testing';
import { script } from '../../models/scripts/script';
import { rating } from '../../models/scripts/rating';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { StorageService } from './storage.service';
import { HttpParams } from '@angular/common/http';

describe('Test script service',()=>{

  let service: StorageService;
  let httpTestingController: HttpTestingController;

  beforeEach(()=>{
    TestBed.configureTestingModule({imports:[HttpClientTestingModule],providers:[StorageService]});
    service = TestBed.inject(StorageService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(()=>{
    httpTestingController.verify();
  });

  it('testing testing',()=>{
    expect(service).toBeTruthy();
  });

});
