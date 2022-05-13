import { TestBed } from '@angular/core/testing';

import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BggSearchService } from './bgg-search.service';

describe('BggSearchService', () => {
  let service: BggSearchService;

  beforeEach(() => {
    TestBed.configureTestingModule({imports: [RouterTestingModule,HttpClientTestingModule]});
    service = TestBed.inject(BggSearchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
