import { Component, EventEmitter, inject, input, Output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { Film } from '../../core/models/film.model';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.scss',
})
export class SearchBarComponent {
  constructor() {}

  router = inject(Router);

  @Output() search = new EventEmitter<string>();

  suggestedMovies = input<Film[]>();

  searchControl = new FormControl('');

  ngOnInit(): void {
    this.searchControl.valueChanges
      .pipe(debounceTime(400), distinctUntilChanged())
      .subscribe((value) => {
        const query = value?.trim();
        this.search.emit(query);
      });
  }

  onNavigate() {
    this.router.navigate(['search'], {
      queryParams: { query: this.searchControl.value },
    });

    this.searchControl.setValue('');
  }

  onNavigateToDetail(id: number) {
    this.router.navigate(['/movie', id]);
  }
}
