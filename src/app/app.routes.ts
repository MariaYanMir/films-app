import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./features/films/films.routes').then((m) => m.FILMS_ROUTES),
  },
];
