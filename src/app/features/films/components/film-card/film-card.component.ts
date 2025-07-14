import { Component, computed, input } from '@angular/core';
import { CastMember, Film } from '../../../../core/models/film.model';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import {
  CircleProgressOptions,
  NgCircleProgressModule,
} from 'ng-circle-progress';

@Component({
  selector: 'app-film-card',
  standalone: true,
  imports: [RouterModule, CommonModule, NgCircleProgressModule],
  providers: [
    {
      provide: CircleProgressOptions,
      useValue: {},
    },
  ],
  templateUrl: './film-card.component.html',
  styleUrl: './film-card.component.scss',
})
export class FilmCardComponent {
  //inputs
  item = input.required<Film | CastMember>();
  discoverPage = input<boolean>(false);

  //computeds
  isFilm = computed(() => 'title' in this.item());
  isCast = computed(() => 'character' in this.item());

  castMember = computed(() => this.item() as CastMember);
  filmItem = computed(() => this.item() as Film);

  posterPath = computed(() => {
    const base = 'https://image.tmdb.org/t/p/w200';
    const data = this.item();

    if ('poster_path' in data && data.poster_path) {
      return `${base}${data.poster_path}`;
    }

    if ('profile_path' in data && data.profile_path) {
      return `${base}${data.profile_path}`;
    }

    return 'assets/no-image.jpg';
  });

  votePercentage = computed(() => {
    const f = this.item();
    return this.isFilm() && 'vote_average' in f
      ? Math.round(f.vote_average * 10)
      : 0;
  });

  //methods
  onImgError(event: Event) {
    (event.target as HTMLImageElement).src = 'assets/no-image.jpg';
  }
}
