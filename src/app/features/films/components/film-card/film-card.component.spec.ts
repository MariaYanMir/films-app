import { render, screen } from '@testing-library/angular';
import { FilmCardComponent } from './film-card.component';
import { Film } from '../../../../core/models/film.model';

const mockFilm: Film = {
  id: 1,
  title: 'Inception',
  original_title: 'Inception',
  overview: '',
  poster_path: '/poster.jpg',
  backdrop_path: null,
  release_date: '2010-07-16',
  vote_average: 8.7,
  vote_count: 10000,
  genre_ids: [],
  original_language: 'en',
  popularity: 100,
  adult: false,
  video: false,
};

describe('FilmCardComponent', () => {
  it('debería renderizar el título de la película', async () => {
    await render(FilmCardComponent, {
      componentInputs: { item: mockFilm },
    });

    expect(screen.getByText('Inception')).toBeTruthy();
  });
});
