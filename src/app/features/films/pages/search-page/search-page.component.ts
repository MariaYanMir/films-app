import { Component, effect, inject, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FilmService } from '../../services/film.service';
import { FilmsSearchService } from '../../services/films-search.service';
import { FilmCardComponent } from '../../components/film-card/film-card.component';
import { MatPaginator, PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-search-page',
  standalone: true,
  imports: [CommonModule, FilmCardComponent, MatPaginator],
  templateUrl: './search-page.component.html',
  styleUrl: './search-page.component.scss',
})
export class SearchPageComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private search = inject(FilmsSearchService);

  searchTerm = this.search.searchTerm;
  movies = this.search.movies;
  page = this.search.currentPage;
  totalPages = this.search.totalPages;
  totalResults = this.search.totalResults;

  readonly pageIndex = computed(() => this.page() - 1);

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params) => {
      const query = params.get('query');
      if (query) {
        this.search.reset();
        this.search.setSearchTerm(query);
      }
    });
  }

  onPageChange(e: PageEvent): void {
    this.search.setPage(e.pageIndex + 1);
  }
}
