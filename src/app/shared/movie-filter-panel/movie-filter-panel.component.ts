import {
  Component,
  ChangeDetectionStrategy,
  OnInit,
  effect,
  inject,
  signal,
  computed,
  Input,
} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { provideNativeDateAdapter } from '@angular/material/core';

import {
  FILM_ORDER_OPTIONS,
  FilmCategory,
  FilmFilters,
} from '../../core/models/film.model';
import { FilmService } from '../../features/films/services/film.service';
import { FilmsSearchService } from '../../features/films/services/films-search.service';

import { MatSelectModule } from '@angular/material/select';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSliderModule } from '@angular/material/slider';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { formatDate } from '../utils/dat-utils';

@Component({
  selector: 'app-movie-filter-panel',
  standalone: true,
  imports: [
    MatSelectModule,
    MatExpansionModule,
    MatDatepickerModule,
    MatSliderModule,
    MatFormFieldModule,
    MatInputModule,
    MatChipsModule,
    ReactiveFormsModule,
    MatSlideToggleModule,
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './movie-filter-panel.component.html',
  styleUrl: './movie-filter-panel.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MovieFilterPanelComponent implements OnInit {
  private formBuilder = inject(FormBuilder);
  private filmService = inject(FilmService);
  private search = inject(FilmsSearchService);

  @Input() autoSearch = false;

  filmOrderOptions = FILM_ORDER_OPTIONS;
  moviesFilters!: FormGroup;

  allGenres = signal<{ id: number; name: string }[]>([]);
  languages = signal<{ code: string; label: string }[]>([]);

  readonly resetFiltersOnCategoryChange = effect(
    () => {
      const category = this.search.category();
      const newDefaults = this.getDefaultFormValuesForCategory(category);
      this.moviesFilters?.reset(newDefaults, { emitEvent: false });
    },
    { allowSignalWrites: true }
  );

  ngOnInit(): void {
    this.initForm();
    this.loadOptions();
    this.setDefaultsByCategory();
  }

  initForm() {
    this.moviesFilters = this.formBuilder.group({
      sort_by: [''],
      release_date_gte: [null],
      release_date_lte: [null],
      with_genres: [[]],
      with_original_language: [''],
      vote_average_gte: [0],
      vote_count_gte: [0],
      with_runtime_lte: [0],
    });
  }

  loadOptions() {
    this.filmService.getGenres().subscribe(this.allGenres.set);
    this.filmService.getLanguages().subscribe(this.languages.set);
  }

  setDefaultsByCategory() {
    const defaults = this.getDefaultFormValuesForCategory(
      this.search.category()
    );
    this.moviesFilters.reset(defaults, { emitEvent: false });
  }

  onSearch(): void {
    this.search.setFilters(this.moviesFilters.value);
    this.search.setPage(1);
  }

  getDefaultFormValuesForCategory(category: FilmCategory): Partial<any> {
    const today = new Date();
    const oneMonthAgo = new Date(today);
    oneMonthAgo.setDate(oneMonthAgo.getDate() - 30);
    const twoMonthsFromNow = new Date(today);
    twoMonthsFromNow.setMonth(twoMonthsFromNow.getMonth() + 2);

    switch (category) {
      case FilmCategory.popular:
        return {
          sort_by: 'popularity.desc',
          vote_count_gte: 0,
          vote_average_gte: 0,
          with_runtime_lte: 0,
        };
      case FilmCategory.topRated:
        return {
          sort_by: 'vote_average.desc',
          vote_count_gte: 200,
          vote_average_gte: 0,
          with_runtime_lte: 0,
        };
      case FilmCategory.upcoming:
        return {
          sort_by: 'popularity.desc',
          release_date_gte: today,
          release_date_lte: twoMonthsFromNow,
          vote_count_gte: 0,
          vote_average_gte: 0,
          with_runtime_lte: 0,
        };
      case FilmCategory.nowPlaying:
        return {
          sort_by: 'popularity.desc',
          release_date_gte: oneMonthAgo,
          release_date_lte: today,
          vote_count_gte: 0,
          vote_average_gte: 0,
          with_runtime_lte: 0,
        };
      default:
        return { sort_by: 'popularity.desc' };
    }
  }

  buildFilterParams(form: any): Record<string, string> {
    const params: Record<string, string> = {};

    if (form.sort_by) params['sort_by'] = form.sort_by;
    if (form.release_date_gte)
      params['release_date.gte'] = formatDate(form.release_date_gte);
    if (form.release_date_lte)
      params['release_date.lte'] = formatDate(form.release_date_lte);
    if (form.vote_average_gte > 0)
      params['vote_average.gte'] = String(form.vote_average_gte);
    if (form.vote_count_gte > 0)
      params['vote_count.gte'] = String(form.vote_count_gte);
    if (form.with_runtime_lte > 0)
      params['with_runtime.lte'] = String(form.with_runtime_lte);
    if (form.with_genres?.length > 0)
      params['with_genres'] = form.with_genres.join(',');
    if (form.with_original_language)
      params['with_original_language'] = form.with_original_language;

    return params;
  }

  toggleGenre(genreId: number): void {
    const genresField = this.moviesFilters.get('with_genres');
    if (!genresField) return;

    const currentGenres: number[] = genresField.value || [];
    const updatedGenres = currentGenres.includes(genreId)
      ? currentGenres.filter((id) => id !== genreId)
      : [...currentGenres, genreId];

    genresField.setValue(updatedGenres);
  }

  isGenreSelected(genreId: number): boolean {
    const selectedGenres = this.moviesFilters.get('with_genres')?.value || [];
    return selectedGenres.includes(genreId);
  }
}
