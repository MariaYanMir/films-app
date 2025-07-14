export interface Film {
  id: number;
  title: string;
  original_title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  genre_ids: number[];
  original_language: string;
  popularity: number;
  adult: boolean;
  video: boolean;
}

export interface FilmApiResponse {
  page: number;
  results: Film[];
  total_pages: number;
  total_results: number;
}

export interface CastMember {
  adult: boolean;
  cast_id: number;
  character: string;
  credit_id: string;
  gender: number;
  id: number;
  known_for_department: string;
  name: string;
  original_name: string;
  popularity: number;
  profile_path: string | null;
  order: number;
}

export interface CrewMember {
  id: number;
  name: string;
  original_name: string;
  job: string;
  department: string;
  profile_path: string | null;
  credit_id: string;
  gender: number;
  popularity: number;
  adult: boolean;
}

export interface FilmDetail extends Film {
  runtime: number;
  genres: { id: number; name: string }[];
  tagline: string;
  status: string;
  homepage: string;
  budget: number;
  revenue: number;
  cast: CastMember[];
  crew: CrewMember[];
}

export enum FilmCategory {
  popular = 'popular',
  topRated = 'top_rated',
  nowPlaying = 'now_playing',
  upcoming = 'upcoming',
}

export const FILM_SECTIONS: { key: FilmCategory; label: string }[] = [
  { key: FilmCategory.popular, label: 'Popular' },
  { key: FilmCategory.topRated, label: 'Mejor puntuadas' },
  { key: FilmCategory.nowPlaying, label: 'En cartelera' },
  { key: FilmCategory.upcoming, label: 'Próximamente' },
];

export const FILM_ORDER_OPTIONS: { value: string; label: string }[] = [
  { value: 'popularity.desc', label: 'Popularidad descendente' },
  { value: 'popularity.asc', label: 'Popularidad ascendente' },
  { value: 'vote_average.desc', label: 'Valoración descendente' },
  { value: 'vote_average.asc', label: 'Valoración ascendente' },
  { value: 'release_date.desc', label: 'Fecha de estreno descendente' },
  { value: 'release_date.asc', label: 'Fecha de estreno ascendente' },
  { value: 'title.asc', label: 'Título (A-Z)' },
  { value: 'title.desc', label: 'Título (Z-A)' },
];

export const LANGUAGES: { code: string; label: string }[] = [
  { code: 'en', label: 'Inglés' },
  { code: 'es', label: 'Español' },
  { code: 'fr', label: 'Francés' },
  { code: 'de', label: 'Alemán' },
  { code: 'it', label: 'Italiano' },
  { code: 'pt', label: 'Portugués' },
  { code: 'ja', label: 'Japonés' },
  { code: 'ko', label: 'Coreano' },
  { code: 'zh', label: 'Chino' },
  { code: 'ru', label: 'Ruso' },
  { code: 'hi', label: 'Hindi' },
  { code: 'ar', label: 'Árabe' },
  { code: 'tr', label: 'Turco' },
  { code: 'pl', label: 'Polaco' },
  { code: 'nl', label: 'Neerlandés' },
  { code: 'sv', label: 'Sueco' },
  { code: 'da', label: 'Danés' },
  { code: 'no', label: 'Noruego' },
  { code: 'fi', label: 'Finés' },
  { code: 'cs', label: 'Checo' },
  { code: 'ro', label: 'Rumano' },
  { code: 'hu', label: 'Húngaro' },
  { code: 'th', label: 'Tailandés' },
];

export interface Language {
  iso_639_1: string;
  english_name: string;
  name: string;
}

export interface FilmFilters {
  sort_by: string;
  'release_date.gte': string | null;
  'release_date.lte': string | null;
  with_genres: number[];
  with_original_language: string;
  'vote_average.gte': number;
  'vote_count.gte': number;
  'with_runtime.lte': number;
}

export const FILTER_KEYS = {
  SORT_BY: 'sort_by',
  RELEASE_DATE_GTE: 'release_date.gte',
  RELEASE_DATE_LTE: 'release_date.lte',
  VOTE_AVERAGE_GTE: 'vote_average.gte',
  VOTE_COUNT_GTE: 'vote_count.gte',
  RUNTIME_LTE: 'with_runtime.lte',
  GENRES: 'with_genres',
  LANGUAGE: 'with_original_language',
  MONETIZATION: 'with_watch_monetization_types',
};
