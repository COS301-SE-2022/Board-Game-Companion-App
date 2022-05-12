import { TestBed } from '@angular/core/testing';

import { BggSearchService } from './bgg-search.service';

describe('BggSearchService', () => {
  let service: BggSearchService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BggSearchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
