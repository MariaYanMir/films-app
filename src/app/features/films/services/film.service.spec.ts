import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { FilmService } from './film.service';
import { environment } from '../../../../enviroments/enviroment';
import { FilmApiResponse } from '../../../core/models/film.model';

describe('FilmService', () => {
  let service: FilmService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [FilmService],
    });

    service = TestBed.inject(FilmService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should fetch movies with filters', () => {
    const mockResponse: FilmApiResponse = {
      page: 1,
      results: [{ id: 1, title: 'Mock Movie' }] as any,
      total_pages: 1,
      total_results: 1,
    };

    const filters = { sort_by: 'popularity.desc' };
    const page = 1;

    service.getMoviesWithFilters(filters, page).subscribe((data) => {
      expect(data).toEqual(mockResponse);
    });

    const req = httpMock.expectOne((request) => {
      return request.url.includes(`${environment.tmdbBaseUrl}/discover/movie`);
    });

    expect(req.request.method).toBe('GET');
    expect(req.request.params.get('sort_by')).toBe('popularity.desc');
    expect(req.request.params.get('page')).toBe('1');
    expect(req.request.params.get('api_key')).toBe(environment.tmdbApiKey);

    req.flush(mockResponse);
  });
});
