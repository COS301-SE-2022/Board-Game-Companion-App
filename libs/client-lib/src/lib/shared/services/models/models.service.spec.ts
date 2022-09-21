import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule} from '@angular/common/http/testing';
import { StorageService } from '../storage/storage.service';
import { ModelsService } from './models.service';
import 'fake-indexeddb/auto';
describe('Test script service',()=>{

  let service: ModelsService;

  beforeEach(()=>{
    TestBed.configureTestingModule({imports:[HttpClientTestingModule],providers:[ModelsService,StorageService]});
    service = TestBed.inject(ModelsService);
  });

  it('should create',()=>{
    expect(service).toBeTruthy();
  });

});
