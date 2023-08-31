import { Injectable } from '@angular/core';
import * as moment from 'moment';

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
    const val = moment(d);
    val.subtract(1, 'days');
    return val.toDate();
  }

  aggiungiGiorni(d: Date, giorni: number): Date {
    const val = moment(d);
    val.add(giorni, 'days');
    return val.toDate();
  }

  getDiffGiorni(start: Date, end: Date): number {
    const valStart = moment(start);
    const valEnd = moment(end);
    return valEnd.diff(valStart, 'days');
  }
}
