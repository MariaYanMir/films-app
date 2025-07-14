import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MovieFilterPanelComponent } from './movie-filter-panel.component';

describe('MovieFilterPanelComponent', () => {
  let component: MovieFilterPanelComponent;
  let fixture: ComponentFixture<MovieFilterPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MovieFilterPanelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MovieFilterPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
