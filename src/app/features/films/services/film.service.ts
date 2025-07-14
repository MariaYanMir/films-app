import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, forkJoin, map, Observable, throwError } from 'rxjs';
import { environment } from '../../../../enviroments/enviroment';
import {
  CATEGORY_ENDPOINTS,
  TMDB_API,
} from '../../../core/config/films-api.config';
import {
  FilmApiResponse,
  FilmCategory,
  FilmDetail,
  FilmFilters,
  Language,
} from '../../../core/models/film.model';
import { cleanFilterParams } from '../../../shared/utils/filters-utils';

@Injectable({
  providedIn: 'root',
})
export class FilmService {
  private http = inject(HttpClient);
  apiKey = environment.tmdbApiKey;
  apiUrl = environment.tmdbBaseUrl;

  baseParams = {
    api_key: this.apiKey,
    language: 'es-ES',
    include_adult: 'false',
    include_video: 'false',
    region: 'ES',
  };

  constructor() {}

  getMoviesByCategory(cat: FilmCategory, page = 1): Observable<any> {
    return this.http
      .get<FilmApiResponse>(CATEGORY_ENDPOINTS[cat], {
        params: { ...this.baseParams, page },
      })
      .pipe(
        catchError((err) => {
          console.error('Error al cargar por categoría', err);
          return throwError(() => err);
        })
      );
  }

  getPopularFilms(page = 1): Observable<any> {
    return this.http
      .get<FilmApiResponse>(TMDB_API.popular, {
        params: { ...this.baseParams, page },
      })
      .pipe(
        catchError((err) => {
          console.error('Error al cargar populares', err);
          return throwError(() => err);
        })
      );
  }

  getTopRatedFilms(page = 1): Observable<any> {
    return this.http
      .get<FilmApiResponse>(TMDB_API.topRated, {
        params: { ...this.baseParams, page },
      })
      .pipe(
        catchError((err) => {
          console.error('Error al cargar más votadas', err);
          return throwError(() => err);
        })
      );
  }

  getNowPlayingFilms(page = 1): Observable<any> {
    return this.http
      .get<FilmApiResponse>(TMDB_API.nowPlaying, {
        params: { ...this.baseParams, page },
      })
      .pipe(
        catchError((err) => {
          console.error('Error al cargar en cartelera', err);
          return throwError(() => err);
        })
      );
  }

  getUpcomingFilms(page = 1): Observable<any> {
    return this.http
      .get<FilmApiResponse>(TMDB_API.upcoming, {
        params: { ...this.baseParams, page },
      })
      .pipe(
        catchError((err) => {
          console.error('Error al cargar próximamente', err);
          return throwError(() => err);
        })
      );
  }

  searchMovies(query: string, page = 1): Observable<FilmApiResponse> {
    return this.http
      .get<FilmApiResponse>(TMDB_API.search, {
        params: {
          ...this.baseParams,
          query: String(query).trim(),
          page,
        },
      })
      .pipe(
        catchError((err) => {
          console.error('Error al buscar película', err);
          return throwError(() => err);
        })
      );
  }

  getMoviesWithFilters(
    filters: Partial<FilmFilters>,
    page = 1
  ): Observable<FilmApiResponse> {
    const safeFilters = cleanFilterParams(filters);

    return this.http
      .get<FilmApiResponse>(TMDB_API.discoverMovie, {
        params: {
          ...this.baseParams,
          ...safeFilters,
          page,
        } as any,
      })
      .pipe(
        catchError((err) => {
          console.error('Error al añadir filtros:', err);
          return throwError(() => err);
        })
      );
  }

  getGenres(): Observable<{ id: number; name: string }[]> {
    return this.http
      .get<{ genres: { id: number; name: string }[] }>(TMDB_API.genreList, {
        params: {
          ...this.baseParams,
        },
      })
      .pipe(map((res) => res.genres));
  }

  getLanguages(): Observable<{ code: string; label: string }[]> {
    const popularLanguageCodes = ['es', 'en', 'fr', 'de', 'it'];

    return this.http
      .get<Language[]>(TMDB_API.languages, {
        params: {
          ...this.baseParams,
        },
      })
      .pipe(
        map((langs) => {
          const all = langs
            .filter((lang) => lang.iso_639_1)
            .map((lang) => ({
              code: lang.iso_639_1,
              label: lang.english_name || lang.name,
            }));

          const popular = all.filter((lang) =>
            popularLanguageCodes.includes(lang.code)
          );

          const others = all
            .filter((lang) => !popularLanguageCodes.includes(lang.code))
            .sort((a, b) => a.label.localeCompare(b.label));

          return [...popular, ...others];
        })
      );
  }

  getMovieDetails(id: number): Observable<FilmDetail> {
    return forkJoin({
      details: this.http.get<FilmDetail>(TMDB_API.detail(id), {
        params: this.baseParams,
      }),
      credits: this.http.get<{ cast: any[]; crew: any[] }>(
        TMDB_API.credits(id),
        { params: this.baseParams }
      ),
    }).pipe(
      map(({ details, credits }) => ({
        ...details,
        cast: credits['cast'],
        crew: credits['crew'],
      })),
      catchError((err) => {
        console.error('Error al cargar detalles', err);
        return throwError(() => err);
      })
    );
  }
}
