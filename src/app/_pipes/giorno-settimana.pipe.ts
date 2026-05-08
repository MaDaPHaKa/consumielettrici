import { Pipe, PipeTransform } from '@angular/core';

const WEEKDAY = ['D', 'L', 'Ma', 'Me', 'G', 'V', 'S'];

@Pipe({
  name: 'giornoSettimana',
  standalone: true,
})
export class GiornoSettimanaPipe implements PipeTransform {
  transform(d: Date | null | undefined): string {
    if (d instanceof Date) return WEEKDAY[d.getDay()];
    return '';
  }
}
