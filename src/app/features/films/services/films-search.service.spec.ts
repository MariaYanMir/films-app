import { TestBed } from '@angular/core/testing';

import { FilmsSearchService } from './films-search.service';

describe('FilmsSearchService', () => {
  let service: FilmsSearchService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FilmsSearchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
