import { Component, inject, signal, WritableSignal } from '@angular/core';
import { FilmService } from '../../services/film.service';
import { CommonModule } from '@angular/common';
import { Film } from '../../../../core/models/film.model';
import { FilmCarouselComponent } from '../../components/film-carousel/film-carousel.component';
import { SearchBarComponent } from '../../../../shared/search-bar/search-bar.component';
import { MatPaginatorModule } from '@angular/material/paginator';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [
    CommonModule,
    MatPaginatorModule,
    FilmCarouselComponent,
    SearchBarComponent,
  ],
  templateUrl: './dashboard-page.component.html',
  styleUrl: './dashboard-page.component.scss',
})
export class DashboardPageComponent {
  constructor() {}

  filmService = inject(FilmService);

  suggestedMovies = signal<Film[]>([]);

  popularFilms = signal<Film[]>([]);
  topRatedFilms = signal<Film[]>([]);
  upcomingFilms = signal<Film[]>([]);
  nowPlayingFilms = signal<Film[]>([]);

  sections = [
    { title: 'Populares', films: this.popularFilms },
    { title: 'Mejor puntuadas', films: this.topRatedFilms },
    { title: 'En cartelera', films: this.nowPlayingFilms },
    { title: 'Próximos estrenos', films: this.upcomingFilms },
  ];

  ngOnInit(): void {
    this.loadSection('popular', this.popularFilms);
    this.loadSection('topRated', this.topRatedFilms);
    this.loadSection('upcoming', this.upcomingFilms);
    this.loadSection('nowPlaying', this.nowPlayingFilms);
  }

  loadSection(
    endpoint: 'popular' | 'topRated' | 'upcoming' | 'nowPlaying',
    signalRef: WritableSignal<Film[]>,
    page = 1
  ) {
    const methods = {
      popular: () => this.filmService.getPopularFilms(page),
      topRated: () => this.filmService.getTopRatedFilms(page),
      upcoming: () => this.filmService.getUpcomingFilms(page),
      nowPlaying: () => this.filmService.getNowPlayingFilms(page),
    };

    methods[endpoint]().subscribe((res) => {
      signalRef.set(res.results);
    });
  }

  onSearch(query: string) {
    this.filmService.searchMovies(query).subscribe((res) => {
      this.suggestedMovies.set(res.results);
    });
  }
}
