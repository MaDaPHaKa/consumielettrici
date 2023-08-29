import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UtilsService {
  weekday = ['D', 'L', 'Ma', 'Me', 'G', 'V', 'S'];
  constructor() {}

  giornoSettimana(d: Date) {
    return this.weekday[d.getDay()];
  }
}
