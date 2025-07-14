import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { FilmService } from '../../services/film.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Film, FilmDetail } from '../../../../core/models/film.model';
import { RuntimePipe } from '../../../../shared/pipes/runtime.pipe';
import { CommonModule } from '@angular/common';
import {
  CircleProgressOptions,
  NgCircleProgressModule,
} from 'ng-circle-progress';
import { FilmCarouselComponent } from '../film-carousel/film-carousel.component';

@Component({
  selector: 'app-film-detail',
  standalone: true,
  imports: [
    RuntimePipe,
    CommonModule,
    NgCircleProgressModule,
    FilmCarouselComponent,
  ],
  providers: [
    {
      provide: CircleProgressOptions,
      useValue: {}, // ← puedes dejarlo vacío o meter config por defecto
    },
  ],
  templateUrl: './film-detail.component.html',
  styleUrl: './film-detail.component.scss',
})
export class FilmDetailComponent implements OnInit {
  filmService = inject(FilmService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  movie = signal<FilmDetail | null>(null);

  readonly year = computed(() => this.movie()?.release_date.slice(0, 4));
  readonly posterPath = computed(() => {
    const base = 'https://image.tmdb.org/t/p/w300';
    return this.movie()?.poster_path
      ? `${base}${this.movie()?.poster_path}`
      : 'assets/no-image.jpg';
  });

  readonly backdropImage = computed(() => {
    const path = this.movie()?.backdrop_path;
    return path
      ? `linear-gradient(to bottom right, rgba(31.5, 10.5, 10.5, 1), rgba(31.5, 10.5, 10.5, 0.84)), url('https://image.tmdb.org/t/p/w1280${path}')`
      : '';
  });

  readonly votePercentage = computed(() => {
    const film = this.movie();
    return film ? Math.round(film.vote_average * 10) : 0;
  });

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = Number(params.get('id'));
      this.filmService.getMovieDetails(id).subscribe((movieDetails) => {
        this.movie.set(movieDetails);
      });
    });
  }
}
