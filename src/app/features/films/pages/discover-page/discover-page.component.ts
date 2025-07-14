import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import {
  FILM_SECTIONS,
  FilmCategory,
} from '../../../../core/models/film.model';
import { FilmsSearchService } from '../../services/films-search.service';
import { filter } from 'rxjs';
import {
  Component,
  computed,
  inject,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilmCardComponent } from '../../components/film-card/film-card.component';
import { MovieFilterPanelComponent } from '../../../../shared/movie-filter-panel/movie-filter-panel.component';
import { MatPaginator, PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-discover-page',
  standalone: true,
  imports: [
    CommonModule,
    FilmCardComponent,
    MovieFilterPanelComponent,
    MatPaginator,
  ],
  templateUrl: './discover-page.component.html',
  styleUrl: './discover-page.component.scss',
})
export class DiscoverPageComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private search = inject(FilmsSearchService);

  filmCategory = FilmCategory;
  pageCategory = signal<FilmCategory>(FilmCategory.popular);

  movies = this.search.movies;
  filters = this.search.filters;
  page = this.search.currentPage;
  totalPages = this.search.totalPages;
  totalResults = this.search.totalResults;

  readonly pageIndex = computed(() => this.page() - 1);

  readonly categoryLabel = computed(() => {
    return (
      FILM_SECTIONS.find((section) => section.key === this.pageCategory())
        ?.label || ''
    );
  });

  private routerSubscription = this.router.events
    .pipe(filter((e) => e instanceof NavigationEnd))
    .subscribe(() => this.handleRouteChange());

  ngOnInit(): void {
    this.handleRouteChange();
  }

  ngOnDestroy(): void {
    this.routerSubscription.unsubscribe();
  }

  handleRouteChange(): void {
    const categoryParam = this.route.snapshot.paramMap.get(
      'category'
    ) as FilmCategory | null;

    this.search.reset();
    this.pageCategory.set(categoryParam ?? FilmCategory.popular);
    this.search.setCategory(this.pageCategory());
  }

  onPageChange(e: PageEvent): void {
    this.search.setPage(e.pageIndex + 1);
  }
}
