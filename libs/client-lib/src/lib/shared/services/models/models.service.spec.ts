import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ModelsService } from './models.service';
describe('Test script service',()=>{

  let service: ModelsService;
  let httpTestingController: HttpTestingController;

  beforeEach(()=>{
    TestBed.configureTestingModule({imports:[HttpClientTestingModule],providers:[ModelsService]});
    service = TestBed.inject(ModelsService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(()=>{
    httpTestingController.verify();
  });

  it('testing testing',()=>{
    expect(service).toBeTruthy();
  });

});
