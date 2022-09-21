import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { CollectionService } from './collection.service';
describe('Test collection service',()=>{

  let service: CollectionService;
  let httpTestingController: HttpTestingController;

  beforeEach(()=>{
    TestBed.configureTestingModule({imports:[HttpClientTestingModule],providers:[CollectionService]});
    service = TestBed.inject(CollectionService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(()=>{
    httpTestingController.verify();
  });

  it('Collection service',()=>{
    expect(service).toBeTruthy();
  });

});