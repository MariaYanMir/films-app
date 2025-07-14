import { FilmCategory } from '../models/film.model';

const BASE_URL = 'https://api.themoviedb.org/3';

export const TMDB_API = {
  base: BASE_URL,
  movie: `${BASE_URL}/movie`,
  search: `${BASE_URL}/search/movie`,
  discoverMovie: `${BASE_URL}/discover/movie`,
  nowPlaying: `${BASE_URL}/movie/now_playing`,
  popular: `${BASE_URL}/movie/popular`,
  topRated: `${BASE_URL}/movie/top_rated`,
  upcoming: `${BASE_URL}/movie/upcoming`,
  genreList: `${BASE_URL}/genre/movie/list`,
  languages: `${BASE_URL}/configuration/languages`,
  detail: (id: number) => `${BASE_URL}/movie/${id}`,
  credits: (id: number) => `${BASE_URL}/movie/${id}/credits`,
  videos: (id: number) => `${BASE_URL}/movie/${id}/videos`,
};

export const CATEGORY_ENDPOINTS: Record<FilmCategory, string> = {
  [FilmCategory.popular]: TMDB_API.popular,
  [FilmCategory.topRated]: TMDB_API.topRated,
  [FilmCategory.nowPlaying]: TMDB_API.nowPlaying,
  [FilmCategory.upcoming]: TMDB_API.upcoming,
};
