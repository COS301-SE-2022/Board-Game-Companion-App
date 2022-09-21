import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { EditorService } from './editor.service';

describe('Test service',()=>{

  let service: EditorService;

  beforeEach(()=>{
    TestBed.configureTestingModule({imports:[HttpClientTestingModule],providers:[EditorService]});
    service = TestBed.inject(EditorService);
  });

  it('should create a service',()=>{
    expect(service).toBeTruthy();
  });

});