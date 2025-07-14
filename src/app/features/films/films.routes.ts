import { Routes } from '@angular/router';
import { DashboardPageComponent } from './pages/dashboard-page/dashboard-page.component';
import { DiscoverPageComponent } from './pages/discover-page/discover-page.component';
import { FilmDetailComponent } from './components/film-detail/film-detail.component';
import { SearchPageComponent } from './pages/search-page/search-page.component';

export const FILMS_ROUTES: Routes = [
  {
    path: '',
    component: DashboardPageComponent,
  },
  {
    path: 'movies/:category',
    component: DiscoverPageComponent,
  },
  {
    path: 'movie/:id',
    component: FilmDetailComponent,
  },
  {
    path: 'search',
    component: SearchPageComponent,
  },
];
