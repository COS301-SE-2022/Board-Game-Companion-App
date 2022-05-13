import { TestBed } from '@angular/core/testing';
import {BggSearchService, MostActive} from './bgg-search.service';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('search service testing',()=>{
    let service:BggSearchService;
    beforeEach(() => {
        TestBed.configureTestingModule({imports: [RouterTestingModule,HttpClientTestingModule]});
        service = TestBed.inject(BggSearchService);
      });
    
      it('should be created', () => {
        expect(service).toBeTruthy();
      });
})