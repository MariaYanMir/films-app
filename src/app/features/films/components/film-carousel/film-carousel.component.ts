import {
  Component,
  input,
  signal,
  ElementRef,
  ViewChild,
  AfterViewInit,
  HostListener,
} from '@angular/core';
import { CastMember, Film } from '../../../../core/models/film.model';
import { FilmCardComponent } from '../film-card/film-card.component';

@Component({
  selector: 'app-film-carousel',
  standalone: true,
  templateUrl: './film-carousel.component.html',
  styleUrls: ['./film-carousel.component.scss'],
  imports: [FilmCardComponent],
})
export class FilmCarouselComponent implements AfterViewInit {
  items = input.required<Film[] | CastMember[]>();

  showLeftFade = signal(false);
  showRightFade = signal(true);

  @ViewChild('scrollContainer', { static: true })
  scrollEl!: ElementRef<HTMLElement>;

  ngAfterViewInit() {
    this.updateFadeState(this.scrollEl.nativeElement);
  }

  @HostListener('wheel', ['$event'])
  onWheel(event: WheelEvent) {
    const el = this.scrollEl.nativeElement;
    el.scrollLeft += event.deltaY;
    event.preventDefault();
    this.updateFadeState(el);
  }

  onScroll() {
    this.updateFadeState(this.scrollEl.nativeElement);
  }

  updateFadeState(container: HTMLElement) {
    const max = container.scrollWidth - container.clientWidth;
    const scroll = container.scrollLeft;

    this.showLeftFade.set(scroll > 5);
    this.showRightFade.set(scroll < max - 5);
  }
}
