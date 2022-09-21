import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { StorageService } from './storage.service';
import 'fake-indexeddb/auto'; 

describe('Test service',()=>{

  let service: StorageService;

  beforeEach(()=>{
    TestBed.configureTestingModule({imports:[HttpClientTestingModule],providers:[StorageService]});
    service = TestBed.inject(StorageService);
  });

  it('testing testing',()=>{
    expect(service).toBeTruthy();
  });

});
