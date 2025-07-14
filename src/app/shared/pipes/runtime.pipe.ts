import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'runtime',
  standalone: true,
})
export class RuntimePipe implements PipeTransform {
  transform(minutes: number): string {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;

    if (h > 0 && m > 0) return `${h}h ${m}min`;
    if (h > 0) return `${h}h`;
    return `${m}min`;
  }
}
