import { Table, liveQuery } from 'dexie';
import { Observable, from } from 'rxjs';
import { Identifiable } from '../_db/db';

export abstract class BaseRepository<T extends Identifiable> {
  table: Table<T, number>;

  constructor(table: Table<T, number>) {
    this.table = table;
  }

  getAll(): Observable<T[]> {
    return from(liveQuery(() => this.table.toArray()));
  }

  get(id: number): Observable<T | undefined> {
    return from(this.table.get(id));
  }

  getByGiorno(giornoVal: Date): Observable<T[]> {
    return from(this.table.where('giorno').equals(giornoVal).toArray());
  }

  save(lettura: T): Observable<number> {
    if (lettura.id) {
      return from(this.table.update(lettura.id, lettura));
    } else {
      return from(this.table.add(lettura));
    }
  }
}
