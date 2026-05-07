import { Injectable } from '@angular/core';

const MS_PER_DAY = 86400000;

@Injectable({
  providedIn: 'root',
})
export class UtilsService {
  weekday = ['D', 'L', 'Ma', 'Me', 'G', 'V', 'S'];
  constructor() {}

  giornoSettimana(d: Date): string {
    if (d) return this.weekday[d.getDay()];
    return '';
  }

  getGiornoPrima(d: Date): Date {
    return this.aggiungiGiorni(d, -1);
  }

  aggiungiGiorni(d: Date, giorni: number): Date {
    const val = new Date(d);
    val.setDate(val.getDate() + giorni);
    return val;
  }

  getDiffGiorni(start: Date, end: Date): number {
    const s = new Date(start);
    const e = new Date(end);
    s.setHours(0, 0, 0, 0);
    e.setHours(0, 0, 0, 0);
    return Math.round((e.getTime() - s.getTime()) / MS_PER_DAY);
  }
}
