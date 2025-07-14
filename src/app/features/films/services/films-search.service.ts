import { computed, effect, inject, Injectable, signal } from '@angular/core';
import {
  Film,
  FilmApiResponse,
  FilmCategory,
  FilmFilters,
} from '../../../core/models/film.model';
import { FilmService } from './film.service';

@Injectable({ providedIn: 'root' })
export class FilmsSearchService {
  private filmService = inject(FilmService);

  readonly movies = signal<Film[]>([]);
  readonly category = signal<FilmCategory>(FilmCategory.popular);
  readonly searchTerm = signal('');
  readonly filters = signal<Partial<FilmFilters>>({});

  readonly currentPage = signal(1);
  readonly totalPages = signal(0);
  readonly totalResults = signal(0);

  readonly searchMode = computed(() => {
    const query = this.searchTerm().trim();
    const filters = this.filters();
    return query
      ? 'search'
      : Object.keys(filters).length > 0
      ? 'filters'
      : 'category';
  });

  constructor() {
    effect(() => {
      const mode = this.searchMode();
      const page = this.currentPage();

      if (mode === 'search') {
        const query = this.searchTerm();
        this.filmService.searchMovies(query, page).subscribe((res) => {
          this.handleResponse(res);
        });
      }

      if (mode === 'filters') {
        const filters = this.filters();
        this.filmService
          .getMoviesWithFilters(filters, page)
          .subscribe((res) => {
            this.handleResponse(res);
          });
      }

      if (mode === 'category') {
        const category = this.category();
        this.filmService
          .getMoviesByCategory(category, page)
          .subscribe((res) => {
            this.handleResponse(res);
          });
      }
    });
  }

  handleResponse = (res: FilmApiResponse) => {
    this.movies.set(res.results);
    this.totalPages.set(res.total_pages);
    this.totalResults.set(res.total_results);
  };

  setSearchTerm(term: string): void {
    this.searchTerm.set(term);
  }

  setFilters(filters: Partial<FilmFilters>): void {
    this.filters.set(filters);
  }

  setCategory(category: FilmCategory): void {
    this.category.set(category);
  }

  setPage(page: number): void {
    this.currentPage.set(page);
  }

  reset(): void {
    this.movies.set([]);
    this.filters.set({});
    this.searchTerm.set('');
    this.category.set(FilmCategory.popular);
    this.currentPage.set(1);
  }
}
